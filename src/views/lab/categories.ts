/**
 * Category metadata and grouping for the Sound Lab.
 *
 * Phonemes are organized into browsable sections — the "periodic table" layout.
 * Oral vowels, nasal vowels, diphthongs and semivowels each form one section;
 * consonants are sub-grouped by articulation manner so the grid reads like a
 * reference chart rather than a flat list.
 */

import type { ArticulationManner, Phoneme, PhonemeType } from '@/core/types'

/** Top-level filter categories (maps onto PhonemeType plus an "all"). */
export type CategoryId = 'all' | PhonemeType

export interface CategoryMeta {
  id: CategoryId
  label: string
  /** Short label for filter chips. */
  short: string
  /** Accent colour classes for section headers + card rings. */
  accent: string
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'all', label: 'All sounds', short: 'All', accent: 'text-amber-300' },
  { id: 'vowel', label: 'Oral vowels', short: 'Vowels', accent: 'text-emerald-300' },
  { id: 'nasal-vowel', label: 'Nasal vowels', short: 'Nasal', accent: 'text-violet-300' },
  { id: 'diphthong', label: 'Nasal diphthongs', short: 'Diphthongs', accent: 'text-fuchsia-300' },
  { id: 'semivowel', label: 'Semivowels', short: 'Glides', accent: 'text-teal-300' },
  { id: 'consonant', label: 'Consonants', short: 'Consonants', accent: 'text-sky-300' },
]

export const CATEGORY_BY_ID: Record<CategoryId, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryMeta>

/** Human label for a consonant manner sub-group. */
const MANNER_LABELS: Record<ArticulationManner, string> = {
  plosive: 'Plosives',
  fricative: 'Fricatives',
  nasal: 'Nasals',
  tap: 'Taps & trills',
  trill: 'Taps & trills',
  affricate: 'Affricates',
  approximant: 'Approximants',
  lateral: 'Liquids',
}

/** Order consonant manners appear in the grid. */
const MANNER_ORDER: ArticulationManner[] = [
  'plosive',
  'fricative',
  'nasal',
  'lateral',
  'tap',
  'trill',
  'affricate',
  'approximant',
]

/** Per-type tile colour: background + text + ring, echoing segmentStyle. */
export function tileColor(p: Phoneme): string {
  switch (p.type) {
    case 'vowel':
      return 'bg-emerald-500/10 text-emerald-100 ring-emerald-400/25'
    case 'nasal-vowel':
      return 'bg-violet-500/10 text-violet-100 ring-violet-400/25'
    case 'diphthong':
      return 'bg-fuchsia-500/10 text-fuchsia-100 ring-fuchsia-400/25'
    case 'semivowel':
      return 'bg-teal-500/10 text-teal-100 ring-teal-400/25'
    case 'consonant':
      return p.voiced
        ? 'bg-indigo-500/10 text-indigo-100 ring-indigo-400/25'
        : 'bg-sky-500/10 text-sky-100 ring-sky-400/25'
    default:
      return 'bg-slate-700/30 text-slate-100 ring-slate-500/25'
  }
}

export interface PhonemeGroup {
  /** Stable key for React. */
  key: string
  /** Section heading shown above the sub-grid. */
  title: string
  accent: string
  phonemes: Phoneme[]
}

/**
 * Group a (already filtered) phoneme list into display sections. Consonants are
 * split by manner; everything else groups by type. Empty groups are dropped so
 * the grid collapses cleanly under filtering.
 */
export function groupPhonemes(phonemes: Phoneme[]): PhonemeGroup[] {
  const groups: PhonemeGroup[] = []
  const byType = (t: PhonemeType) => phonemes.filter((p) => p.type === t)

  const simpleSections: { type: PhonemeType; meta: CategoryMeta }[] = [
    { type: 'vowel', meta: CATEGORY_BY_ID['vowel'] },
    { type: 'nasal-vowel', meta: CATEGORY_BY_ID['nasal-vowel'] },
    { type: 'diphthong', meta: CATEGORY_BY_ID['diphthong'] },
    { type: 'semivowel', meta: CATEGORY_BY_ID['semivowel'] },
  ]

  for (const { type, meta } of simpleSections) {
    const items = byType(type)
    if (items.length) {
      groups.push({ key: type, title: meta.label, accent: meta.accent, phonemes: items })
    }
  }

  // Consonants, sub-grouped by manner in a fixed order.
  const consonants = byType('consonant')
  const seenManners = new Set<string>()
  for (const manner of MANNER_ORDER) {
    const label = MANNER_LABELS[manner]
    if (seenManners.has(label)) continue
    // Collect all manners that share this label (e.g. tap + trill -> "Taps & trills").
    const mannersForLabel = MANNER_ORDER.filter((m) => MANNER_LABELS[m] === label)
    seenManners.add(label)
    const items = consonants.filter((p) => p.manner && mannersForLabel.includes(p.manner))
    if (items.length) {
      groups.push({
        key: `consonant-${label}`,
        title: label,
        accent: CATEGORY_BY_ID['consonant'].accent,
        phonemes: items,
      })
    }
  }

  // Any consonant without a recognised manner (defensive) lands in a catch-all.
  const leftover = consonants.filter((p) => !p.manner || !MANNER_ORDER.includes(p.manner))
  if (leftover.length) {
    groups.push({
      key: 'consonant-other',
      title: 'Other consonants',
      accent: CATEGORY_BY_ID['consonant'].accent,
      phonemes: leftover,
    })
  }

  return groups
}
