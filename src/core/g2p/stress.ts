/**
 * Primary stress assignment for European Portuguese.
 *
 * EP stress is highly regular and falls out of three rules, applied in order:
 *
 *  1. An explicit accent mark (acute, circumflex, or tilde on á â ã é ê í ó ô
 *     õ ú) marks its own syllable as stressed. (The grave à is a contraction
 *     marker, not a stress mark, so it is ignored here.)
 *  2. Otherwise, if the word ends in l, r, z, x, i, u, or one of the nasal
 *     endings im/ins/um/uns, stress falls on the LAST syllable (oxytone).
 *  3. Otherwise stress falls on the PENULTIMATE syllable (paroxytone) — the
 *     default for words ending in a vowel or in -m/-s/-ns plurals.
 *
 * Monosyllables are always index 0.
 */

const ACCENTED = new Set([
  'á', 'â', 'ã',
  'é', 'ê',
  'í',
  'ó', 'ô', 'õ',
  'ú',
])

/** Letters that, as a word's final letter, pull stress to the last syllable. */
const OXYTONE_FINALS = new Set(['l', 'r', 'z', 'x', 'i', 'u'])

function hasAccent(text: string): boolean {
  for (const ch of text) {
    if (ACCENTED.has(ch)) return true
  }
  return false
}

/**
 * Assign primary stress, returning the index of the stressed syllable.
 *
 * `syllables` is the orthographic split from `syllabify`; `word` is the whole
 * written form (used for the ending-based rules).
 */
export function assignStress(syllables: string[], word: string): number {
  if (syllables.length <= 1) return 0

  // Rule 1: explicit accent wins. If several are present (rare), the last one
  // marked carries primary stress in the standard analysis; in practice EP words
  // have a single graphic accent, so the first match is the stress.
  for (let i = 0; i < syllables.length; i++) {
    if (hasAccent(syllables[i])) return i
  }

  // Rule 2: oxytone endings (no accent present, checked above).
  const lower = word.toLowerCase()
  const last = lower[lower.length - 1]
  const lastTwo = lower.slice(-2)
  const lastThree = lower.slice(-3)

  const endsOxytone =
    OXYTONE_FINALS.has(last) ||
    lastTwo === 'im' ||
    lastTwo === 'um' ||
    lastThree === 'ins' ||
    lastThree === 'uns'

  if (endsOxytone) return syllables.length - 1

  // Rule 3: default paroxytone.
  return syllables.length - 2
}
