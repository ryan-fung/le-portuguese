/**
 * Public API for the European Portuguese grapheme-to-phoneme engine.
 *
 * The engine turns a written EP word into a full phonetic breakdown: per-segment
 * phonemes, syllables, primary stress, a whole-word IPA transcription, and an
 * English-facing respelling. See ./portuguese for the rule architecture.
 */

export { analyze } from './portuguese'
export { syllabify, syllabifyParts, type SyllableParts } from './syllabify'
export { assignStress } from './stress'
export { respellPhoneme } from './respell'

export type { G2PSegment, Syllable, WordAnalysis } from '@/core/types'
