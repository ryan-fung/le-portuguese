/**
 * Canonical European Portuguese phoneme inventory — the single source of truth
 * for phoneme IDs used across the whole app.
 *
 * The G2P engine may ONLY emit ids listed here. The phoneme inventory
 * (src/data/phonemes.ts) must provide a full Phoneme object for each id here.
 * A unit test enforces that these two stay in sync.
 *
 * IDs are stable kebab-case keys. Do not rename without a migration.
 */

import type { PhonemeType } from './types'

export interface PhonemeIdEntry {
  id: string
  ipa: string
  type: PhonemeType
  /** Especially distinctive of European (vs Brazilian) Portuguese. */
  signatureEP?: boolean
}

export const PHONEME_IDS = {
  // --- Oral vowels ---------------------------------------------------------
  'a-open': { id: 'a-open', ipa: 'a', type: 'vowel' },
  'a-central': { id: 'a-central', ipa: 'ɐ', type: 'vowel', signatureEP: true },
  'e-open': { id: 'e-open', ipa: 'ɛ', type: 'vowel' },
  'e-close': { id: 'e-close', ipa: 'e', type: 'vowel' },
  'e-central': { id: 'e-central', ipa: 'ɨ', type: 'vowel', signatureEP: true },
  'i-close': { id: 'i-close', ipa: 'i', type: 'vowel' },
  'o-open': { id: 'o-open', ipa: 'ɔ', type: 'vowel' },
  'o-close': { id: 'o-close', ipa: 'o', type: 'vowel' },
  'u-close': { id: 'u-close', ipa: 'u', type: 'vowel' },

  // --- Nasal vowels --------------------------------------------------------
  'a-nasal': { id: 'a-nasal', ipa: 'ɐ̃', type: 'nasal-vowel', signatureEP: true },
  'e-nasal': { id: 'e-nasal', ipa: 'ẽ', type: 'nasal-vowel' },
  'i-nasal': { id: 'i-nasal', ipa: 'ĩ', type: 'nasal-vowel' },
  'o-nasal': { id: 'o-nasal', ipa: 'õ', type: 'nasal-vowel' },
  'u-nasal': { id: 'u-nasal', ipa: 'ũ', type: 'nasal-vowel' },

  // --- Nasal diphthongs ----------------------------------------------------
  'ao-nasal': { id: 'ao-nasal', ipa: 'ɐ̃w̃', type: 'diphthong', signatureEP: true },
  'ae-nasal': { id: 'ae-nasal', ipa: 'ɐ̃j̃', type: 'diphthong' },
  'oe-nasal': { id: 'oe-nasal', ipa: 'õj̃', type: 'diphthong' },

  // --- Semivowels (glides) -------------------------------------------------
  'j-glide': { id: 'j-glide', ipa: 'j', type: 'semivowel' },
  'w-glide': { id: 'w-glide', ipa: 'w', type: 'semivowel' },

  // --- Plosives ------------------------------------------------------------
  p: { id: 'p', ipa: 'p', type: 'consonant' },
  b: { id: 'b', ipa: 'b', type: 'consonant' },
  t: { id: 't', ipa: 't', type: 'consonant' },
  d: { id: 'd', ipa: 'd', type: 'consonant' },
  k: { id: 'k', ipa: 'k', type: 'consonant' },
  g: { id: 'g', ipa: 'ɡ', type: 'consonant' },

  // --- Fricatives ----------------------------------------------------------
  f: { id: 'f', ipa: 'f', type: 'consonant' },
  v: { id: 'v', ipa: 'v', type: 'consonant' },
  s: { id: 's', ipa: 's', type: 'consonant' },
  z: { id: 'z', ipa: 'z', type: 'consonant' },
  sh: { id: 'sh', ipa: 'ʃ', type: 'consonant', signatureEP: true },
  zh: { id: 'zh', ipa: 'ʒ', type: 'consonant' },

  // --- Nasals --------------------------------------------------------------
  m: { id: 'm', ipa: 'm', type: 'consonant' },
  n: { id: 'n', ipa: 'n', type: 'consonant' },
  nh: { id: 'nh', ipa: 'ɲ', type: 'consonant' },

  // --- Liquids -------------------------------------------------------------
  l: { id: 'l', ipa: 'l', type: 'consonant' },
  'l-dark': { id: 'l-dark', ipa: 'ɫ', type: 'consonant', signatureEP: true },
  lh: { id: 'lh', ipa: 'ʎ', type: 'consonant' },
  'r-tap': { id: 'r-tap', ipa: 'ɾ', type: 'consonant' },
  'r-uvular': { id: 'r-uvular', ipa: 'ʁ', type: 'consonant', signatureEP: true },
} as const satisfies Record<string, PhonemeIdEntry>

export type PhonemeId = keyof typeof PHONEME_IDS

/** Runtime set of valid ids, for validation in tests and the engine. */
export const VALID_PHONEME_IDS: ReadonlySet<string> = new Set(Object.keys(PHONEME_IDS))

export function isPhonemeId(id: string): id is PhonemeId {
  return VALID_PHONEME_IDS.has(id)
}
