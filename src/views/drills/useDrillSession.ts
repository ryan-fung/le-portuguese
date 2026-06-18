/**
 * Session state + SRS wiring for the Drills view.
 *
 * `useDrillSession` owns the lifecycle of one practice session: which drills are
 * queued, the current index, per-drill results, and committing each review to
 * the SRS store. `useDrillStats` is a read-only selector for the start screen
 * (how many are due, total, a simple streak).
 */

import { useCallback, useMemo, useState } from 'react'
import { useStore } from '@/store'
import { review, isDue, type Grade } from '@/lib/srs'
import { allDrillEntries, cardId, type DrillEntry } from './drillData'

export type SessionMode =
  | { kind: 'due' }
  | { kind: 'quick'; size: number }
  | { kind: 'lesson'; source: string; label: string }
  | { kind: 'all' }

export interface DrillResult {
  entry: DrillEntry
  grade: Grade
  /** True when the learner picked the correct option (n/a for read-aloud). */
  correct: boolean
}

const DEFAULT_QUICK = 10

/** Stable, lightweight stats for the start screen. */
export function useDrillStats() {
  const srs = useStore((s) => s.srs)

  return useMemo(() => {
    const entries = allDrillEntries()
    const now = new Date()
    let due = 0
    let started = 0
    for (const entry of entries) {
      const stored = srs[cardId(entry.drill)]
      if (!stored) {
        // Never-seen drills are implicitly due (fresh cards are due now).
        due += 1
        continue
      }
      started += 1
      if (isDue(stored.card, now)) due += 1
    }
    return { total: entries.length, due, started }
  }, [srs])
}

/** Order a list of entries: overdue/new first (by how overdue), then the rest. */
function prioritise(entries: DrillEntry[], srs: ReturnType<typeof useStore.getState>['srs']): DrillEntry[] {
  const now = Date.now()
  const dueMs = (entry: DrillEntry): number => {
    const stored = srs[cardId(entry.drill)]
    if (!stored) return -Infinity // brand new — highest priority
    const due = stored.card.due
    return (due instanceof Date ? due.getTime() : new Date(due).getTime()) - now
  }
  return [...entries].sort((a, b) => dueMs(a) - dueMs(b))
}

function buildQueue(mode: SessionMode, srs: ReturnType<typeof useStore.getState>['srs']): DrillEntry[] {
  const entries = allDrillEntries()
  const now = new Date()

  switch (mode.kind) {
    case 'due': {
      const dueEntries = entries.filter((e) => {
        const stored = srs[cardId(e.drill)]
        return !stored || isDue(stored.card, now)
      })
      return prioritise(dueEntries, srs)
    }
    case 'quick': {
      return prioritise(entries, srs).slice(0, mode.size)
    }
    case 'lesson': {
      return prioritise(
        entries.filter((e) => e.source === mode.source),
        srs,
      )
    }
    case 'all':
      return prioritise(entries, srs)
  }
}

export interface DrillSession {
  active: boolean
  queue: DrillEntry[]
  index: number
  current: DrillEntry | null
  results: DrillResult[]
  /** Start a session for the given mode. No-op if the queue would be empty. */
  start: (mode: SessionMode) => void
  /** Record a grade for the current drill, persist SRS, and advance. */
  grade: (grade: Grade, correct: boolean) => void
  /** Abandon the session and return to the start screen. */
  cancel: () => void
  /** True once every queued drill has been graded. */
  finished: boolean
}

export function useDrillSession(): DrillSession {
  const ensureCard = useStore((s) => s.ensureCard)
  const updateCard = useStore((s) => s.updateCard)

  const [queue, setQueue] = useState<DrillEntry[]>([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<DrillResult[]>([])
  const [active, setActive] = useState(false)

  const start = useCallback((mode: SessionMode) => {
    const srs = useStore.getState().srs
    const built = buildQueue(mode, srs)
    if (built.length === 0) return
    setQueue(built)
    setIndex(0)
    setResults([])
    setActive(true)
  }, [])

  const grade = useCallback(
    (g: Grade, correct: boolean) => {
      const entry = queue[index]
      if (!entry) return
      const id = cardId(entry.drill)
      const stored = ensureCard(id)
      const next = review(stored.card, g)
      updateCard(id, next)
      setResults((prev) => [...prev, { entry, grade: g, correct }])
      setIndex((i) => i + 1)
    },
    [queue, index, ensureCard, updateCard],
  )

  const cancel = useCallback(() => {
    setActive(false)
    setQueue([])
    setIndex(0)
    setResults([])
  }, [])

  const finished = active && index >= queue.length && queue.length > 0
  const current = active && index < queue.length ? queue[index] : null

  return { active, queue, index, current, results, start, grade, cancel, finished }
}

export { DEFAULT_QUICK }
