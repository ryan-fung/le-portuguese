/**
 * Orthographic syllabification for European Portuguese.
 *
 * This splits a *written* word into syllables based on spelling, which is all
 * the downstream stress + G2P passes need. It is not a phonological syllabifier
 * (it works on letters, not sounds), but it follows the standard EP rules:
 *
 *  - Every syllable is built around a vowel nucleus; diphthongs (falling: ai,
 *    ei, oi, au, eu, ou, ui, iu and the nasal ão/ãe/õe) stay together, while two
 *    full vowels in a row are a hiatus and split (Lis-bo-a, do-en-te).
 *  - The inseparable digraphs ch, lh, nh (one sound) and the qu/gu clusters
 *    never split.
 *  - A consonant between vowels joins the following syllable; in a longer
 *    cluster only a valid onset (a muta-cum-liquida group like br/tr/pl, or a
 *    digraph) moves to the next syllable, the rest stays as coda (car-ro,
 *    cis-ne, mes-mo, liv-ros).
 *
 * Known simplifications (documented, low impact for the trainer's word lists):
 *  - Rising diphthongs / glide+vowel like "história", "rua" are treated as
 *    hiatus.
 *  - Unmarked hiatus such as "raiz" (ra-iz) is read as a diphthong.
 */

const VOWELS = new Set([
  'a', 'e', 'i', 'o', 'u', 'y',
  'á', 'à', 'â', 'ã',
  'é', 'è', 'ê',
  'í', 'ì', 'ï',
  'ó', 'ò', 'ô', 'õ',
  'ú', 'ù', 'ü',
])

/** Oral vowels that can head a falling diphthong (excludes nasal ã/õ). */
const ORAL_VOWELS = new Set([
  'a', 'e', 'i', 'o', 'u', 'y',
  'á', 'à', 'â', 'é', 'è', 'ê', 'í', 'ì', 'ó', 'ò', 'ô', 'ú', 'ù',
])

/** Plain (unaccented) i/u act as the off-glide of a falling diphthong. */
const FALLING_GLIDES = new Set(['i', 'u'])

const ONSET_HEADS = new Set(['p', 'b', 't', 'd', 'c', 'g', 'f', 'v'])
const DIGRAPH_ONSETS = new Set(['ch', 'lh', 'nh', 'qu', 'gu'])

export interface SyllableParts {
  onset: string
  nucleus: string
  coda: string
  text: string
}

function isVowel(ch: string): boolean {
  return VOWELS.has(ch)
}

/** Whether `b` continues the nucleus started by current last char `a`. */
function isDiphthong(a: string, b: string): boolean {
  if (a === 'ã' && (b === 'e' || b === 'i' || b === 'o')) return true
  if (a === 'õ' && (b === 'e' || b === 'i')) return true
  if (FALLING_GLIDES.has(b) && ORAL_VOWELS.has(a)) return true
  return false
}

/** True when `cluster` (1–2 letters) is a legal syllable onset. */
function isValidOnset(cluster: string): boolean {
  if (cluster.length === 1) return true
  if (cluster.length === 2) {
    if (DIGRAPH_ONSETS.has(cluster)) return true
    const [head, tail] = [cluster[0], cluster[1]]
    if ((tail === 'l' || tail === 'r') && ONSET_HEADS.has(head)) return true
    return false
  }
  return false
}

interface Token {
  type: 'C' | 'V'
  text: string
}

/**
 * Tokenize a word into consonant clusters and vowel-nuclei, keeping digraphs
 * (ch/lh/nh/qu/gu) and falling diphthongs together.
 */
function tokenize(word: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = word.length

  while (i < n) {
    const ch = word[i]

    if (isVowel(ch)) {
      // Build a nucleus, absorbing any falling-diphthong off-glides.
      let nucleus = ch
      let j = i + 1
      while (j < n && isVowel(word[j]) && isDiphthong(nucleus[nucleus.length - 1], word[j])) {
        nucleus += word[j]
        j++
      }
      tokens.push({ type: 'V', text: nucleus })
      i = j
      continue
    }

    // Consonant run: grab consecutive consonants, preserving digraphs.
    let cons = ''
    while (i < n && !isVowel(word[i])) {
      const pair = word.slice(i, i + 2)
      // qu / gu only count as a unit before a vowel.
      if (
        (DIGRAPH_ONSETS.has(pair) && (pair === 'ch' || pair === 'lh' || pair === 'nh')) ||
        ((pair === 'qu' || pair === 'gu') && i + 2 < n && isVowel(word[i + 2]))
      ) {
        cons += pair
        i += 2
      } else {
        cons += word[i]
        i += 1
      }
    }
    tokens.push({ type: 'C', text: cons })
  }

  return tokens
}

/** Split a consonant run between a preceding nucleus's coda and the next onset. */
function splitCluster(cons: string, hasFollowingVowel: boolean): { coda: string; onset: string } {
  if (!hasFollowingVowel) {
    // Trailing consonants are all coda (e.g. final -s, -r, -l, -ns).
    return { coda: cons, onset: '' }
  }
  if (cons.length === 0) return { coda: '', onset: '' }

  // A single consonant (or digraph onset) always starts the next syllable.
  if (cons.length === 1 || DIGRAPH_ONSETS.has(cons) || isValidOnset(cons)) {
    return { coda: '', onset: cons }
  }

  // Otherwise pull the largest valid onset off the end (2-letter muta-cum-liquida
  // or digraph), leaving the rest as coda. Try the trailing two letters first.
  const lastTwo = cons.slice(-2)
  if (isValidOnset(lastTwo)) {
    return { coda: cons.slice(0, -2), onset: lastTwo }
  }
  // Fall back to a single trailing consonant as the onset.
  return { coda: cons.slice(0, -1), onset: cons.slice(-1) }
}

/**
 * Syllabify a word into structured parts (onset / nucleus / coda). Used by the
 * G2P engine, which needs to know which consonants are codas.
 */
export function syllabifyParts(word: string): SyllableParts[] {
  const lower = word.toLowerCase()
  const tokens = tokenize(lower)
  if (tokens.length === 0) return []

  const syllables: SyllableParts[] = []
  let pendingOnset = ''
  let idx = 0

  // A leading consonant run before the first vowel is the first onset.
  if (tokens[0].type === 'C') {
    pendingOnset = tokens[0].text
    idx = 1
  }

  while (idx < tokens.length) {
    const tok = tokens[idx]
    if (tok.type === 'V') {
      const nucleus = tok.text
      // Look at the consonant run that follows (if any) to assign coda/onset.
      const next = tokens[idx + 1]
      const afterNext = tokens[idx + 2]
      let coda = ''
      let nextOnset = ''
      if (next && next.type === 'C') {
        const hasFollowingVowel = !!afterNext && afterNext.type === 'V'
        const split = splitCluster(next.text, hasFollowingVowel)
        coda = split.coda
        nextOnset = split.onset
        idx += 2 // consumed nucleus + consonant run
      } else {
        idx += 1 // consumed nucleus only
      }
      syllables.push({
        onset: pendingOnset,
        nucleus,
        coda,
        text: pendingOnset + nucleus + coda,
      })
      pendingOnset = nextOnset
    } else {
      // Two consonant runs in a row shouldn't happen after tokenize, but guard.
      pendingOnset += tok.text
      idx += 1
    }
  }

  // A dangling onset with no nucleus (rare, e.g. malformed input) attaches to
  // the last syllable as coda.
  if (pendingOnset && syllables.length > 0) {
    const last = syllables[syllables.length - 1]
    last.coda += pendingOnset
    last.text = last.onset + last.nucleus + last.coda
  }

  return syllables
}

/** Split a written EP word into orthographic syllables. */
export function syllabify(word: string): string[] {
  const parts = syllabifyParts(word)
  if (parts.length === 0) return word ? [word.toLowerCase()] : []
  return parts.map((p) => p.text)
}
