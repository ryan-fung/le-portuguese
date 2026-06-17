/**
 * Visual encoding for phoneme segments — shared by the Reader and Sound Lab so
 * the colour language is consistent everywhere. Colour communicates the broad
 * sound category at a glance; silent letters are muted and struck through.
 */

import { PHONEME_IDS } from '@/core/phoneme-ids'
import type { G2PSegment } from '@/core/types'

export interface SegmentStyle {
  /** Tailwind classes for the tile background + text. */
  className: string
  label: string
}

const VOWEL = {
  className: 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30',
  label: 'Vowel',
}
const NASAL = {
  className: 'bg-violet-500/15 text-violet-200 ring-1 ring-violet-400/30',
  label: 'Nasal vowel',
}
const VOICED = {
  className: 'bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-400/30',
  label: 'Voiced consonant',
}
const VOICELESS = {
  className: 'bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30',
  label: 'Voiceless consonant',
}
const GLIDE = {
  className: 'bg-teal-500/15 text-teal-200 ring-1 ring-teal-400/30',
  label: 'Glide',
}
const SILENT = {
  className: 'bg-slate-700/40 text-slate-500 line-through ring-1 ring-slate-600/40',
  label: 'Silent',
}

const VOICELESS_IDS = new Set(['p', 't', 'k', 'f', 's', 'sh'])

export function styleForSegment(seg: G2PSegment): SegmentStyle {
  if (seg.silent || !seg.phonemeId) return SILENT
  const entry = PHONEME_IDS[seg.phonemeId as keyof typeof PHONEME_IDS]
  if (!entry) return SILENT
  switch (entry.type) {
    case 'vowel':
      return VOWEL
    case 'nasal-vowel':
    case 'diphthong':
      return NASAL
    case 'semivowel':
      return GLIDE
    case 'consonant':
      return VOICELESS_IDS.has(entry.id) ? VOICELESS : VOICED
    default:
      return VOICED
  }
}

export const SEGMENT_LEGEND: SegmentStyle[] = [VOWEL, NASAL, VOICED, VOICELESS, GLIDE, SILENT]
