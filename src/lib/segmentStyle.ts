/**
 * Visual encoding for phoneme segments — shared by the Reader and Sound Lab so
 * the colour language is consistent everywhere. Colour communicates the broad
 * sound category at a glance; silent letters are muted and struck through.
 */

import { PHONEME_IDS } from '@/core/phoneme-ids'
import type { G2PSegment } from '@/core/types'

export interface SegmentStyle {
  /** CSS class for the tile theme styling. */
  className: string
  label: string
}

const VOWEL = {
  className: 'segment-vowel',
  label: 'Vowel',
}
const NASAL = {
  className: 'segment-nasal',
  label: 'Nasal vowel',
}
const VOICED = {
  className: 'segment-voiced',
  label: 'Voiced consonant',
}
const VOICELESS = {
  className: 'segment-voiceless',
  label: 'Voiceless consonant',
}
const GLIDE = {
  className: 'segment-glide',
  label: 'Glide',
}
const SILENT = {
  className: 'segment-silent',
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
