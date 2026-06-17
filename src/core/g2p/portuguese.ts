/**
 * European Portuguese grapheme-to-phoneme engine.
 *
 * `analyze(word)` is the public entry point. It runs in two phases, which is the
 * key to getting EP right:
 *
 *   1. STRUCTURE — syllabify the written word and assign primary stress
 *      (`./syllabify`, `./stress`). Stress must be known *before* vowels are
 *      realized, because EP's signature feature is stress-conditioned vowel
 *      reduction (unstressed a/e/o collapse to ɐ/ɨ/u).
 *   2. REALIZATION — walk each syllable's onset / nucleus / coda through an
 *      ordered, context-sensitive rule set that emits `G2PSegment`s. Context
 *      includes neighbouring syllables (for intervocalic-s voicing, sibilant
 *      assimilation, rr/ss across boundaries) and the stress flag (for vowels).
 *
 * EP phenomena modelled here that a naive Brazilian-rules engine gets wrong:
 *  - vowel reduction (ɐ, ɨ, u in unstressed syllables);
 *  - stressed `a` → ɐ before a nasal consonant (cama → ˈkɐmɐ);
 *  - syllable-final sibilants → ʃ (voiceless/final) or ʒ (before voiced);
 *  - dark coda l (ɫ), uvular ʁ for rr/word-initial r vs tap ɾ elsewhere;
 *  - the EP "ei" → [ɐj] shift (peixe → ˈpɐjʃɨ) and "ou" → [o] monophthong;
 *  - nasal vowels/diphthongs from vowel + coda m/n, with the nasal absorbed.
 *
 * Deliberate simplifications (see also inline TODOs):
 *  - Open vs close mid vowels (ɛ/e, ɔ/o) are NOT predictable from unaccented
 *    spelling; stressed e/o default to the close values e/o. Accents resolve it.
 *  - `x` is read as ʃ by default, with the common `ex`+vowel → [z] heuristic;
 *    the [ks]/[s] readings (táxi, próximo) are not modelled.
 *  - Rising diphthongs / some hiatus are simplified (see syllabify.ts).
 */

import type { G2PSegment, Syllable, WordAnalysis } from '@/core/types'
import { PHONEME_IDS, type PhonemeId } from '@/core/phoneme-ids'
import { assignStress } from './stress'
import { respellPhoneme } from './respell'
import { syllabifyParts, type SyllableParts } from './syllabify'

const FRONT_VOWELS = new Set(['e', 'é', 'è', 'ê', 'i', 'í', 'ì', 'ï', 'y'])
const GLIDE_LETTERS = new Set(['i', 'í', 'u', 'ú', 'y'])
/** Onset-initial letters that count as "voiced" for coda-sibilant assimilation. */
const VOICED_ONSET_LETTERS = new Set(['b', 'd', 'g', 'v', 'z', 'j', 'l', 'm', 'n', 'r'])
const CONS_DIGRAPHS = new Set(['ch', 'lh', 'nh', 'qu', 'gu'])

/** Matches a word-initial `ex` + vowel, which yields [iz...] (exame → iˈzamɨ). */
const EX_Z_PREFIX = /^ex[aáàâãeéêiíoóôõuú]/

function seg(grapheme: string, phonemeId: PhonemeId): G2PSegment {
  return { grapheme, phonemeId, respelling: respellPhoneme(phonemeId) }
}

function silentSeg(grapheme: string): G2PSegment {
  return { grapheme, silent: true }
}

// ---------------------------------------------------------------------------
// Vowel realization
// ---------------------------------------------------------------------------

/** Realize a single oral vowel letter given stress and a following nasal onset. */
function realizeOralVowel(letter: string, stressed: boolean, followingNasal: boolean): PhonemeId {
  switch (letter) {
    // Accented vowels carry their quality explicitly.
    case 'á': return 'a-open'
    case 'â': return 'a-central'
    case 'é': return 'e-open'
    case 'ê': return 'e-close'
    case 'í': return 'i-close'
    case 'ó': return 'o-open'
    case 'ô': return 'o-close'
    case 'ú': return 'u-close'
    case 'à': return 'a-open'

    case 'a':
      // Unstressed a → ɐ. Stressed a → a, but ɐ before a nasal consonant
      // (cama → ˈkɐmɐ, exame → iˈzɐmɨ).
      if (!stressed) return 'a-central'
      return followingNasal ? 'a-central' : 'a-open'
    case 'e':
      // Unstressed e → the ghost vowel ɨ; stressed e defaults to close e.
      // TODO: ɛ vs e is not predictable without an accent; we default to e.
      return stressed ? 'e-close' : 'e-central'
    case 'o':
      // Unstressed o → u; stressed o defaults to close o.
      // TODO: ɔ vs o is not predictable without an accent; we default to o.
      return stressed ? 'o-close' : 'u-close'
    case 'i': case 'y': return 'i-close'
    case 'u': return 'u-close'
    default: return 'a-central'
  }
}

/** The glide a falling-diphthong off-glide i/u becomes. */
function glideFor(letter: string): PhonemeId {
  return letter === 'u' || letter === 'ú' ? 'w-glide' : 'j-glide'
}

/** Nasal counterpart of a base oral vowel letter (for vowel + coda m/n). */
function nasalVowelFor(letter: string): PhonemeId {
  switch (letter) {
    case 'a': case 'á': case 'â': case 'ã': return 'a-nasal'
    case 'e': case 'é': case 'ê': return 'e-nasal'
    case 'i': case 'í': return 'i-nasal'
    case 'o': case 'ó': case 'ô': case 'õ': return 'o-nasal'
    case 'u': case 'ú': return 'u-nasal'
    default: return 'a-nasal'
  }
}

/**
 * Realize a nucleus (1–3 letters) into one or more segments.
 *
 * `coda` is this syllable's own coda; `nextOnset` the following syllable's onset
 * (to detect a nasalizing or following-nasal context); `isLast` whether this is
 * the final syllable (controls word-final nasal diphthongs).
 */
function realizeNucleus(
  nucleus: string,
  stressed: boolean,
  coda: string,
  nextOnset: string,
  isLast: boolean,
): G2PSegment[] {
  const followingNasal = nextOnset.startsWith('m') || nextOnset.startsWith('n')
  const codaNasal = coda.startsWith('m') || coda.startsWith('n')

  // 1) Explicit tilde: nasal vowel or nasal diphthong lives in the letters.
  if (nucleus.includes('ã') || nucleus.includes('õ')) {
    if (nucleus === 'ão') return [seg('ão', 'ao-nasal')]
    if (nucleus === 'ãe' || nucleus === 'ãi') return [seg(nucleus, 'ae-nasal')]
    if (nucleus === 'õe' || nucleus === 'õi') return [seg(nucleus, 'oe-nasal')]
    return [seg(nucleus, nasalVowelFor(nucleus[0]))]
  }

  // 2) Vowel + coda m/n → nasal vowel (the m/n is absorbed, handled in coda).
  if (codaNasal && nucleus.length === 1) {
    // Word-final -am/-em diphthongize: falam → ˈfalɐ̃w̃, bem → bɐ̃j̃.
    if (isLast && coda === 'm') {
      if (nucleus === 'a') return [seg('a', 'ao-nasal')]
      if (nucleus === 'e' || nucleus === 'é' || nucleus === 'ê') return [seg('e', 'ae-nasal')]
    }
    return [seg(nucleus, nasalVowelFor(nucleus))]
  }

  // 3) Oral nucleus.
  if (nucleus.length === 1) {
    return [seg(nucleus, realizeOralVowel(nucleus, stressed, followingNasal))]
  }

  // Falling diphthong: main vowel + off-glide.
  const main = nucleus[0]
  const off = nucleus[nucleus.length - 1]
  if (GLIDE_LETTERS.has(off) && off !== main) {
    // EP "ou" monophthongizes to a plain [o].
    if (main === 'o' && off === 'u') return [seg('ou', stressed ? 'o-close' : 'u-close')]
    // EP "ei" → [ɐj], a signature shift (peixe → ˈpɐjʃɨ, primeiro → priˈmɐjru).
    if ((main === 'e') && off === 'i') {
      return [seg('e', 'a-central'), seg(off, 'j-glide')]
    }
    return [
      seg(main, realizeOralVowel(main, stressed, followingNasal)),
      seg(off, glideFor(off)),
    ]
  }

  // Fallback (hiatus that slipped through): realize each vowel on its own.
  return [...nucleus].map((v) => seg(v, realizeOralVowel(v, stressed, false)))
}

// ---------------------------------------------------------------------------
// Consonant tokenization
// ---------------------------------------------------------------------------

/** Split a consonant run into units, keeping ch/lh/nh/qu/gu digraphs whole. */
function consUnits(cons: string): string[] {
  const units: string[] = []
  let i = 0
  while (i < cons.length) {
    const pair = cons.slice(i, i + 2)
    if (CONS_DIGRAPHS.has(pair)) {
      units.push(pair)
      i += 2
    } else {
      units.push(cons[i])
      i += 1
    }
  }
  return units
}

// ---------------------------------------------------------------------------
// Onset realization
// ---------------------------------------------------------------------------

/**
 * Realize a syllable onset. `nucleusFirst` is the first nucleus letter (for
 * c/g softening and qu/gu glide vs silent-u). `wordInitial` flags the very
 * first onset of the word; `prevCoda` is the previous syllable's coda (for
 * rr/ss merges); `prevHadVowelCoda` whether the previous syllable ended in a
 * bare vowel (intervocalic voicing of s). `exZ` turns this onset's x into z.
 */
function realizeOnset(
  onset: string,
  nucleusFirst: string,
  wordInitial: boolean,
  prevCoda: string,
  prevHadVowelCoda: boolean,
  exZ: boolean,
): G2PSegment[] {
  const units = consUnits(onset)
  const out: G2PSegment[] = []

  units.forEach((u, idx) => {
    const isLastUnit = idx === units.length - 1
    const frontNext = FRONT_VOWELS.has(nucleusFirst)

    switch (u) {
      case 'ch': out.push(seg(u, 'sh')); return
      case 'lh': out.push(seg(u, 'lh')); return
      case 'nh': out.push(seg(u, 'nh')); return
      case 'qu':
        // qu + e/i → k with silent u; qu + a/o → k + w-glide.
        out.push(seg('q', 'k'))
        out.push(frontNext ? silentSeg('u') : seg('u', 'w-glide'))
        return
      case 'gu':
        out.push(seg('g', 'g'))
        out.push(frontNext ? silentSeg('u') : seg('u', 'w-glide'))
        return
      case 'c':
        out.push(seg('c', isLastUnit && frontNext ? 's' : 'k'))
        return
      case 'ç': out.push(seg('ç', 's')); return
      case 'g':
        out.push(seg('g', isLastUnit && frontNext ? 'zh' : 'g'))
        return
      case 'j': out.push(seg('j', 'zh')); return
      case 'h': out.push(silentSeg('h')); return
      case 'x': {
        if (exZ && idx === 0) { out.push(seg('x', 'z')); return }
        out.push(seg('x', 'sh'))
        return
      }
      case 's': {
        // ss across a boundary (previous coda already an s) stays voiceless s.
        if (prevCoda.endsWith('s')) { out.push(seg('s', 's')); return }
        // Single intervocalic s → z; word-initial / post-consonant s → s.
        const intervocalic = !wordInitial && prevHadVowelCoda
        out.push(seg('s', intervocalic ? 'z' : 's'))
        return
      }
      case 'z': out.push(seg('z', 'z')); return
      case 'r': {
        // Word-initial r and rr (prev coda r, merged here) → uvular; else tap.
        const uvular = (wordInitial && idx === 0) || prevCoda.endsWith('r')
        out.push(seg('r', uvular ? 'r-uvular' : 'r-tap'))
        return
      }
      case 'p': out.push(seg('p', 'p')); return
      case 'b': out.push(seg('b', 'b')); return
      case 't': out.push(seg('t', 't')); return
      case 'd': out.push(seg('d', 'd')); return
      case 'k': out.push(seg('k', 'k')); return
      case 'f': out.push(seg('f', 'f')); return
      case 'v': out.push(seg('v', 'v')); return
      case 'm': out.push(seg('m', 'm')); return
      case 'n': out.push(seg('n', 'n')); return
      case 'l': out.push(seg('l', 'l')); return
      default:
        // w, y and other rare loanword letters: leave silent rather than emit
        // an invalid phoneme id.
        out.push(silentSeg(u))
    }
  })

  return out
}

// ---------------------------------------------------------------------------
// Coda realization
// ---------------------------------------------------------------------------

/**
 * Realize a syllable coda. `nucleusNasalized` is true when the nucleus already
 * absorbed a leading m/n as nasality (so that m/n becomes a silent segment).
 * `nextOnset` decides sibilant voicing; `isWordFinal` whether word-final.
 */
function realizeCoda(
  coda: string,
  nucleusNasalized: boolean,
  nextOnset: string,
  isWordFinal: boolean,
): G2PSegment[] {
  if (!coda) return []
  const out: G2PSegment[] = []
  const letters = [...coda]

  letters.forEach((c, idx) => {
    const isCodaFinal = idx === letters.length - 1
    switch (c) {
      case 'm':
      case 'n':
        // The nasal that nasalized the vowel is absorbed (silent).
        if (idx === 0 && nucleusNasalized) out.push(silentSeg(c))
        else out.push(seg(c, c === 'm' ? 'm' : 'n'))
        return
      case 's':
      case 'z':
      case 'x': {
        // Coda sibilant: ʒ before a voiced consonant, otherwise ʃ.
        // An s immediately before an onset s is the geminate's first half and
        // is realized by the onset, so silence it.
        if (isCodaFinal && !isWordFinal && nextOnset.startsWith('s')) {
          out.push(silentSeg(c))
          return
        }
        const beforeVoiced =
          isCodaFinal && !isWordFinal && VOICED_ONSET_LETTERS.has(nextOnset[0] ?? '')
        out.push(seg(c, beforeVoiced ? 'zh' : 'sh'))
        return
      }
      case 'r':
        // An r before an onset r is the first half of rr; silence it.
        if (isCodaFinal && !isWordFinal && nextOnset.startsWith('r')) {
          out.push(silentSeg('r'))
          return
        }
        out.push(seg('r', 'r-tap'))
        return
      case 'l': out.push(seg('l', 'l-dark')); return
      // Rare coda consonants (loan/learned words): give a best-effort value.
      case 'b': out.push(seg('b', 'b')); return
      case 'p': out.push(seg('p', 'p')); return
      case 'c': out.push(seg('c', 'k')); return
      case 'g': out.push(seg('g', 'g')); return
      case 'd': out.push(seg('d', 'd')); return
      case 't': out.push(seg('t', 't')); return
      case 'f': out.push(seg('f', 'f')); return
      default: out.push(silentSeg(c))
    }
  })

  return out
}

// ---------------------------------------------------------------------------
// Whole-word assembly
// ---------------------------------------------------------------------------

function buildIpa(syllables: Syllable[], stressIndex: number): string {
  return syllables
    .map((syl, i) => {
      const body = syl.segments
        .filter((s) => s.phonemeId)
        .map((s) => PHONEME_IDS[s.phonemeId as PhonemeId].ipa)
        .join('')
      const mark = i === stressIndex && syllables.length > 1 ? 'ˈ' : ''
      return mark + body
    })
    .join('')
}

function buildRespelling(syllables: Syllable[], stressIndex: number): string {
  return syllables
    .map((syl, i) => {
      const body = syl.segments
        .filter((s) => s.respelling)
        .map((s) => s.respelling)
        .join('')
      return i === stressIndex && syllables.length > 1 ? body.toUpperCase() : body
    })
    .filter((s) => s.length > 0)
    .join('-')
}

/** Analyze a written EP word into its full phonetic breakdown. */
export function analyze(word: string): WordAnalysis {
  const input = word
  const lower = word.normalize('NFC').toLowerCase().trim()
  const parts: SyllableParts[] = syllabifyParts(lower)

  if (parts.length === 0) {
    return { input, segments: [], syllables: [], stressIndex: -1, ipa: '', respelling: '' }
  }

  const syllableTexts = parts.map((p) => p.text)
  const assigned = assignStress(syllableTexts, lower)
  // Monosyllables are phonetically stressed (index 0) but reported as -1.
  const effectiveStress = parts.length === 1 ? 0 : assigned
  const stressIndex = parts.length === 1 ? -1 : assigned
  const exZ = EX_Z_PREFIX.test(lower)

  const syllables: Syllable[] = parts.map((part, i) => {
    const prev = parts[i - 1]
    const next = parts[i + 1]
    const stressed = i === effectiveStress
    const isLast = i === parts.length - 1
    const nextOnset = next ? next.onset : ''

    const onsetSegs = realizeOnset(
      part.onset,
      part.nucleus[0] ?? '',
      i === 0,
      prev ? prev.coda : '',
      !!prev && prev.coda === '',
      exZ && i === 1,
    )

    const nucleusSegs = realizeNucleus(part.nucleus, stressed, part.coda, nextOnset, isLast)
    // The nucleus is nasal when it realized to a nasal vowel or nasal diphthong;
    // if so, a leading coda m/n is absorbed rather than pronounced.
    const nucleusNasalized = nucleusSegs.some((s) => {
      if (!s.phonemeId) return false
      const t = PHONEME_IDS[s.phonemeId as PhonemeId].type
      return t === 'nasal-vowel' || t === 'diphthong'
    })

    const codaSegs = realizeCoda(part.coda, nucleusNasalized, nextOnset, isLast)

    return { segments: [...onsetSegs, ...nucleusSegs, ...codaSegs], stressed }
  })

  const flat: G2PSegment[] = syllables.flatMap((s) => s.segments)
  const ipa = buildIpa(syllables, effectiveStress)
  const respelling = buildRespelling(syllables, effectiveStress)

  return { input, segments: flat, syllables, stressIndex, ipa, respelling }
}
