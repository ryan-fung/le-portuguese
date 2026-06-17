/**
 * Core domain types for Lê — the European Portuguese pronunciation trainer.
 *
 * These types are the shared contract across the whole app: the G2P engine,
 * the phoneme inventory, the SRS layer, and every view depend on them. Treat
 * changes here as breaking changes.
 */

// ---------------------------------------------------------------------------
// Phonemes
// ---------------------------------------------------------------------------

export type PhonemeType = 'vowel' | 'nasal-vowel' | 'diphthong' | 'consonant' | 'semivowel'

export type ArticulationManner =
  | 'plosive'
  | 'nasal'
  | 'tap'
  | 'trill'
  | 'fricative'
  | 'affricate'
  | 'approximant'
  | 'lateral'

export type ArticulationPlace =
  | 'bilabial'
  | 'labiodental'
  | 'dental'
  | 'alveolar'
  | 'postalveolar'
  | 'palatal'
  | 'velar'
  | 'uvular'
  | 'glottal'

export type VowelHeight = 'close' | 'near-close' | 'close-mid' | 'mid' | 'open-mid' | 'near-open' | 'open'
export type VowelBackness = 'front' | 'central' | 'back'

/** A spoken sound of European Portuguese, with English-anchored teaching aids. */
export interface Phoneme {
  /** Stable kebab-case key used everywhere: G2P output, audio lookup, SRS cards. */
  id: string
  /** IPA symbol, e.g. 'ɨ', 'ʃ', 'ɐ̃'. */
  ipa: string
  /** Human label, e.g. 'Close central unrounded vowel'. */
  name: string
  type: PhonemeType

  // Articulatory features (consonants)
  manner?: ArticulationManner
  place?: ArticulationPlace
  voiced?: boolean

  // Articulatory features (vowels)
  height?: VowelHeight
  backness?: VowelBackness
  rounded?: boolean
  nasal?: boolean

  /**
   * The headline teaching aid: how this sounds to an English speaker.
   * e.g. "like the 'e' in 'roses' — a tiny swallowed uh".
   */
  englishAnchor: string
  /** Plain-English articulation instructions (how to make the sound). */
  howTo: string
  /** Short memorable hook, optional. */
  mnemonic?: string

  /** Portuguese example words illustrating the sound. */
  examples: PhonemeExample[]
  /** Minimal pairs / near-contrasts that learners confuse. */
  contrasts?: PhonemeContrast[]

  /** Path to bundled audio, e.g. '/audio/close-central-unrounded.mp3'. */
  audio?: string
  /** True if this sound is especially distinctive of European (vs Brazilian) PT. */
  signatureEP?: boolean
}

export interface PhonemeExample {
  /** The Portuguese word. */
  word: string
  /** The grapheme(s) in the word that produce this phoneme, e.g. 'e'. */
  highlight?: string
  /** Optional English gloss — meaning is secondary in this app, but helps. */
  gloss?: string
}

export interface PhonemeContrast {
  /** id of the phoneme being contrasted against. */
  withId: string
  /** Why learners confuse them / how to tell them apart. */
  note: string
  /** Optional minimal pair, e.g. ['avô', 'avó']. */
  pair?: [string, string]
}

// ---------------------------------------------------------------------------
// Grapheme-to-phoneme (G2P) output
// ---------------------------------------------------------------------------

/**
 * One spelling-to-sound unit: a chunk of the written word mapped to a phoneme.
 * A silent letter maps to no phoneme (phonemeId undefined, silent true).
 */
export interface G2PSegment {
  /** The literal letters consumed from the input, e.g. 'lh', 'ã', 's'. */
  grapheme: string
  /** Phoneme id, or undefined when silent. */
  phonemeId?: string
  silent?: boolean
  /**
   * The English-facing respelling for this segment, e.g. 'sh', 'uh'.
   * Lets readers sound out a word with zero IPA knowledge.
   */
  respelling?: string
}

/** A syllable: its segments plus whether it carries primary stress. */
export interface Syllable {
  segments: G2PSegment[]
  stressed: boolean
}

/** Full analysis of one written word. */
export interface WordAnalysis {
  /** The original input word, as written. */
  input: string
  /** Flat list of segments (convenience; also grouped into syllables). */
  segments: G2PSegment[]
  syllables: Syllable[]
  /** Index of the stressed syllable, or -1 if monosyllable/unknown. */
  stressIndex: number
  /** Whole-word IPA transcription, e.g. /ʃəˈmar/. */
  ipa: string
  /** Whole-word English respelling, e.g. 'shuh-MAR'. */
  respelling: string
}

// ---------------------------------------------------------------------------
// Curriculum + SRS
// ---------------------------------------------------------------------------

export type LessonKind = 'sound' | 'spelling-rule' | 'contrast' | 'passage'

export interface Lesson {
  id: string
  kind: LessonKind
  title: string
  /** One-line summary of what the learner will be able to do after. */
  goal: string
  /** Phoneme ids this lesson introduces or drills. */
  phonemeIds: string[]
  /** Ordered prerequisite lesson ids. */
  requires?: string[]
  /** Free-form teaching body (markdown-ish), rendered by the lesson view. */
  body: string
  /** Practice items for this lesson. */
  drills: Drill[]
}

export type DrillKind =
  | 'read-aloud' // show word/passage, learner reads, self-grades
  | 'listen-discriminate' // play audio, pick which of N sounds/words it was
  | 'spell-to-sound' // show spelling, pick the correct respelling/IPA
  | 'sound-to-spell' // play/show sound, pick the word that contains it

export interface Drill {
  id: string
  kind: DrillKind
  prompt: string
  /** Target word or phoneme id, depending on kind. */
  target: string
  /** Distractor options (for multiple-choice kinds). */
  options?: string[]
  /** Index of the correct option within `options`. */
  answer?: number
}

/** SRS review state for a single trackable item (a phoneme or a drill). */
export interface ReviewItem {
  /** Composite key, e.g. 'phoneme:close-central' or 'drill:l-01'. */
  id: string
  /** Serialized ts-fsrs Card state. */
  card: unknown
  lastReviewed?: number
}
