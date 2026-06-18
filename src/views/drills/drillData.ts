/**
 * Drill data layer for the Drills view.
 *
 * Two sources feed the session builder:
 *   1. Authored drills from the curriculum (`ALL_DRILLS`).
 *   2. Auto-generated listen-discriminate drills built from every phoneme
 *      `contrast` that ships a minimal `pair` (e.g. caro / carro). These are the
 *      highest-value EP exercises, so we mint one per contrast pair and give it
 *      a stable id (`auto-<phonemeId>-<withId>`) so its SRS card persists.
 *
 * Everything is keyed for SRS as `drill:<drill.id>`.
 */

import type { Drill } from '@/core/types'
import { ALL_DRILLS, CURRICULUM } from '@/data/curriculum'
import { PHONEMES, getPhoneme } from '@/data/phonemes'

/** SRS card id for a drill. */
export function cardId(drill: Drill): string {
  return `drill:${drill.id}`
}

/** A drill plus where it came from, for grouping and labels in the UI. */
export interface DrillEntry {
  drill: Drill
  /** Lesson id for authored drills, or 'auto' for generated contrast drills. */
  source: string
  /** Human label for the source group. */
  sourceLabel: string
  /** Extra teaching note shown on reveal (the contrast note, when generated). */
  note?: string
}

/**
 * Build listen-discriminate drills from phoneme contrasts that have a minimal
 * pair. We dedupe mirrored contrasts (a↔b and b↔a describe the same pair) by
 * keeping only the first ordering we encounter, comparing the sorted words.
 */
export function autoContrastDrills(): DrillEntry[] {
  const entries: DrillEntry[] = []
  const seenPairs = new Set<string>()

  for (const phoneme of PHONEMES) {
    for (const contrast of phoneme.contrasts ?? []) {
      const pair = contrast.pair
      if (!pair) continue
      const other = getPhoneme(contrast.withId)
      if (!other) continue

      // Dedupe by the unordered set of the two words.
      const key = [...pair].sort().join('|')
      if (seenPairs.has(key)) continue
      seenPairs.add(key)

      // The drill plays `phoneme`'s word; that word is whichever member of the
      // pair illustrates the current phoneme. By data convention the FIRST word
      // of the pair belongs to the phoneme that owns the contrast.
      const [own, otherWord] = pair
      const options = [own, otherWord]
      const answer = 0

      const drill: Drill = {
        id: `auto-${phoneme.id}-${contrast.withId}`,
        kind: 'listen-discriminate',
        prompt: `Which word did you hear? (${phoneme.name} vs ${other.name})`,
        target: own,
        options,
        answer,
      }

      entries.push({
        drill,
        source: 'auto',
        sourceLabel: 'Minimal pairs',
        note: contrast.note,
      })
    }
  }

  return entries
}

/** Authored curriculum drills, tagged with their lesson. */
export function authoredDrills(): DrillEntry[] {
  return CURRICULUM.flatMap((lesson) =>
    lesson.drills.map((drill) => ({
      drill,
      source: lesson.id,
      sourceLabel: lesson.title,
    })),
  )
}

/** Every drill the app knows about: authored + auto-generated, deduped by id. */
export function allDrillEntries(): DrillEntry[] {
  const all = [...authoredDrills(), ...autoContrastDrills()]
  const byId = new Map<string, DrillEntry>()
  for (const entry of all) {
    if (!byId.has(entry.drill.id)) byId.set(entry.drill.id, entry)
  }
  return [...byId.values()]
}

// A defensive guard so a future curriculum edit can't silently shadow a drill.
void ALL_DRILLS

/** Group entries by their source, preserving curriculum order then auto. */
export interface DrillGroup {
  source: string
  label: string
  entries: DrillEntry[]
}

export function groupEntries(entries: DrillEntry[]): DrillGroup[] {
  const order: string[] = [...CURRICULUM.map((l) => l.id), 'auto']
  const map = new Map<string, DrillGroup>()
  for (const entry of entries) {
    let group = map.get(entry.source)
    if (!group) {
      group = { source: entry.source, label: entry.sourceLabel, entries: [] }
      map.set(entry.source, group)
    }
    group.entries.push(entry)
  }
  return [...map.values()].sort(
    (a, b) => order.indexOf(a.source) - order.indexOf(b.source),
  )
}
