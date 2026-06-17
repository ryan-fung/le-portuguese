/**
 * English-facing respelling for each phoneme.
 *
 * The respelling layer lets a learner sound out a Portuguese word with zero IPA
 * knowledge: every phoneme maps to a short ASCII fragment chosen to evoke the
 * closest English value. Fragments are deliberately rough — EP has sounds with
 * no English equivalent (ɲ, ʎ, ʁ, ɐ̃, ɨ) so these are best-effort hints, not
 * exact equivalents. The engine joins fragments per syllable and upper-cases the
 * stressed syllable, e.g. chamar -> "shuh-MAR".
 */

import type { PhonemeId } from '@/core/phoneme-ids'

const RESPELL: Record<PhonemeId, string> = {
  // Oral vowels
  'a-open': 'ah',
  'a-central': 'uh',
  'e-open': 'eh',
  'e-close': 'ay',
  'e-central': 'uh', // the "ghost" vowel ɨ — barely there
  'i-close': 'ee',
  'o-open': 'aw',
  'o-close': 'oh',
  'u-close': 'oo',

  // Nasal vowels (the "ng" is a reminder to push air through the nose, not a real g)
  'a-nasal': 'uhng',
  'e-nasal': 'eng',
  'i-nasal': 'eeng',
  'o-nasal': 'ong',
  'u-nasal': 'oong',

  // Nasal diphthongs
  'ao-nasal': 'owng',
  'ae-nasal': 'eyng',
  'oe-nasal': 'oyng',

  // Glides
  'j-glide': 'y',
  'w-glide': 'w',

  // Plosives
  p: 'p',
  b: 'b',
  t: 't',
  d: 'd',
  k: 'k',
  g: 'g',

  // Fricatives
  f: 'f',
  v: 'v',
  s: 's',
  z: 'z',
  sh: 'sh',
  zh: 'zh',

  // Nasals
  m: 'm',
  n: 'n',
  nh: 'ny',

  // Liquids
  l: 'l',
  'l-dark': 'll',
  lh: 'ly',
  'r-tap': 'r',
  'r-uvular': 'rr',
}

/** English-facing respelling fragment for a phoneme id. */
export function respellPhoneme(id: PhonemeId): string {
  return RESPELL[id]
}
