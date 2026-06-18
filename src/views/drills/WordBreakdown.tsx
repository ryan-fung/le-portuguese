/**
 * Educational breakdown of a Portuguese word, shown when a drill is revealed.
 * Runs the G2P engine and renders the whole-word IPA + respelling plus a
 * syllable-by-syllable strip with the stressed syllable highlighted. The whole
 * point of Lê's drills is "always show WHY", and this is the why.
 */

import { useMemo } from 'react'
import { Volume2 } from 'lucide-react'
import { analyze } from '@/core/g2p'
import { speak } from '@/lib/speech'
import { useStore } from '@/store'

interface WordBreakdownProps {
  word: string
  /** Show a play button that speaks the word. */
  speakable?: boolean
}

export function WordBreakdown({ word, speakable = true }: WordBreakdownProps) {
  const rate = useStore((s) => s.speechRate)
  const analysis = useMemo(() => {
    try {
      return analyze(word)
    } catch {
      return null
    }
  }, [word])

  if (!analysis) {
    return <p className="text-sm text-slate-400">{word}</p>
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold text-slate-100">{analysis.input}</span>
        {speakable && (
          <button
            type="button"
            onClick={() => speak(word, { rate })}
            aria-label={`Hear ${word}`}
            className="rounded-full p-1.5 text-amber-300 transition hover:bg-amber-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Volume2 size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
        <span className="ipa text-amber-300">/{analysis.ipa}/</span>
        <span className="text-slate-300">{analysis.respelling}</span>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        {analysis.syllables.map((syl, i) => {
          const text = syl.segments.map((s) => s.grapheme).join('')
          return (
            <span
              key={i}
              className={`rounded-md px-2 py-1 text-sm ring-1 ${
                syl.stressed
                  ? 'bg-amber-400/15 text-amber-200 ring-amber-400/40'
                  : 'bg-slate-800 text-slate-300 ring-slate-700'
              }`}
            >
              {text || '·'}
            </span>
          )
        })}
      </div>
    </div>
  )
}
