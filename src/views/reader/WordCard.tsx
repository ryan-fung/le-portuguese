/**
 * Renders a single analysed word as a row of syllable groups, each made of
 * colour-coded segment tiles. The stressed syllable gets an amber underline.
 * Per-word controls let the learner hear the word spoken (TTS) or played sound
 * by sound (concatenated phoneme clips). Tapping a tile opens its detail.
 */

import { motion } from 'framer-motion'
import { Volume2, ListMusic } from 'lucide-react'
import type { WordAnalysis, G2PSegment, Syllable } from '@/core/types'
import { styleForSegment } from '@/lib/segmentStyle'
import { PHONEME_IDS } from '@/core/phoneme-ids'

interface WordCardProps {
  analysis: WordAnalysis
  showIpa: boolean
  showRespelling: boolean
  /** Hide speak button when no TTS is available. */
  canSpeak: boolean
  onSpeakWord: (word: string) => void
  onPlaySounds: (analysis: WordAnalysis) => void
  onSelectSegment: (phonemeId: string) => void
  /** Stagger index for the enter animation. */
  index: number
}

export function WordCard({
  analysis,
  showIpa,
  showRespelling,
  canSpeak,
  onSpeakWord,
  onPlaySounds,
  onSelectSegment,
  index,
}: WordCardProps) {
  return (
    <motion.span
      className="inline-flex flex-col gap-1.5 rounded-xl bg-slate-900/40 p-2 align-top"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.015, 0.4) }}
    >
      <span className="flex flex-wrap items-end gap-1.5">
        {analysis.syllables.map((syllable, si) => (
          <SyllableGroup
            key={si}
            syllable={syllable}
            showIpa={showIpa}
            showRespelling={showRespelling}
            onSelectSegment={onSelectSegment}
          />
        ))}
      </span>

      <span className="flex items-center justify-between gap-2 px-0.5">
        <span className="ipa text-xs text-slate-500" aria-hidden={!analysis.ipa}>
          {analysis.ipa && `/${analysis.ipa}/`}
        </span>
        <span className="flex gap-1">
          {canSpeak && (
            <button
              type="button"
              onClick={() => onSpeakWord(analysis.input)}
              aria-label={`Speak the word ${analysis.input}`}
              className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Volume2 size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={() => onPlaySounds(analysis)}
            aria-label={`Play ${analysis.input} sound by sound`}
            className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <ListMusic size={14} />
          </button>
        </span>
      </span>
    </motion.span>
  )
}

function SyllableGroup({
  syllable,
  showIpa,
  showRespelling,
  onSelectSegment,
}: {
  syllable: Syllable
  showIpa: boolean
  showRespelling: boolean
  onSelectSegment: (phonemeId: string) => void
}) {
  return (
    <span
      className={`flex gap-0.5 rounded-md pb-1 ${
        syllable.stressed ? 'border-b-2 border-amber-400' : 'border-b-2 border-transparent'
      }`}
      title={syllable.stressed ? 'Stressed syllable' : undefined}
    >
      {syllable.segments.map((segment, gi) => (
        <SegmentTile
          key={gi}
          segment={segment}
          showIpa={showIpa}
          showRespelling={showRespelling}
          onSelectSegment={onSelectSegment}
        />
      ))}
    </span>
  )
}

function SegmentTile({
  segment,
  showIpa,
  showRespelling,
  onSelectSegment,
}: {
  segment: G2PSegment
  showIpa: boolean
  showRespelling: boolean
  onSelectSegment: (phonemeId: string) => void
}) {
  const style = styleForSegment(segment)
  const interactive = !!segment.phonemeId && !segment.silent

  const inner = (
    <>
      <span className="text-base font-semibold leading-none">{segment.grapheme}</span>
      {(showIpa || showRespelling) && !segment.silent && (
        <span className="mt-1 flex flex-col items-center leading-tight">
          {showIpa && segment.phonemeId && (
            <span className="ipa text-[11px] opacity-90">{ipaFor(segment)}</span>
          )}
          {showRespelling && segment.respelling && (
            <span className="text-[10px] text-slate-400">{segment.respelling}</span>
          )}
        </span>
      )}
    </>
  )

  const className = `flex min-h-[44px] min-w-[28px] flex-col items-center justify-center rounded-md px-1.5 py-1 ${style.className}`

  if (!interactive) {
    return (
      <span className={className} title={style.label}>
        {inner}
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={() => segment.phonemeId && onSelectSegment(segment.phonemeId)}
      aria-label={`Sound ${segment.grapheme}: open detail`}
      className={`${className} cursor-pointer transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300`}
    >
      {inner}
    </button>
  )
}

function ipaFor(segment: G2PSegment): string {
  if (!segment.phonemeId) return ''
  const entry = PHONEME_IDS[segment.phonemeId as keyof typeof PHONEME_IDS]
  return entry?.ipa ?? ''
}
