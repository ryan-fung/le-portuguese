/**
 * Lightweight in-lesson practice. The full drill engine (SRS, grading) lives in
 * the Drills view; here we just let the learner try each item: read-aloud drills
 * get a word breakdown + speak button, multiple-choice drills get tappable
 * options with an inline reveal of the correct answer. No scoring is recorded.
 */

import { useState } from 'react'
import { Check, X, Volume2 } from 'lucide-react'
import type { Drill } from '@/core/types'
import { getPhoneme } from '@/data/phonemes'
import { speak } from '@/lib/speech'
import { useStore } from '@/store'
import { WordBreakdown } from './WordBreakdown'

const CHOICE_KINDS = new Set(['listen-discriminate', 'spell-to-sound', 'sound-to-spell'])

export function DrillList({ drills }: { drills: Drill[] }) {
  if (drills.length === 0) return null
  return (
    <ol className="space-y-3">
      {drills.map((drill) => (
        <li key={drill.id}>
          <DrillItem drill={drill} />
        </li>
      ))}
    </ol>
  )
}

function DrillItem({ drill }: { drill: Drill }) {
  const rate = useStore((s) => s.speechRate)
  const isChoice = CHOICE_KINDS.has(drill.kind) && drill.options && drill.options.length > 0

  return (
    <div className="rounded-xl bg-slate-800/40 p-3 ring-1 ring-slate-700/50">
      <p className="mb-2 text-sm text-slate-300">{drill.prompt}</p>
      {isChoice ? (
        <ChoiceDrill drill={drill} />
      ) : (
        <ReadAloudDrill target={drill.target} rate={rate} />
      )}
    </div>
  )
}

function ReadAloudDrill({ target, rate }: { target: string; rate: number }) {
  // A passage (multiple words) is hard to break down word-by-word inline, so we
  // keep it to a speak button; single words get the full breakdown.
  const isPhrase = /\s/.test(target.trim())
  if (isPhrase) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-900/50 px-3 py-2 ring-1 ring-slate-700/50">
        <span className="text-base font-medium text-slate-100">{target}</span>
        <button
          type="button"
          onClick={() => speak(target, { rate })}
          aria-label={`Speak: ${target}`}
          className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Volume2 size={16} />
        </button>
      </div>
    )
  }
  return <WordBreakdown word={target} />
}

function ChoiceDrill({ drill }: { drill: Drill }) {
  const [picked, setPicked] = useState<number | null>(null)
  const rate = useStore((s) => s.speechRate)
  const options = drill.options ?? []
  const answer = drill.answer ?? -1

  // For listen-discriminate the target sound is what to "hear" — let the learner
  // play the correct word so they can match it. We expose a play button per
  // option (it's a Portuguese word) since these are short.
  const targetPhoneme = getPhoneme(drill.target)

  return (
    <div className="space-y-2">
      {targetPhoneme && drill.kind === 'sound-to-spell' && (
        <p className="text-xs text-slate-500">
          Target sound: <span className="ipa text-slate-300">{targetPhoneme.ipa}</span>{' '}
          {targetPhoneme.englishAnchor}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const revealed = picked !== null
          const correct = i === answer
          const isPicked = picked === i
          let cls = 'bg-slate-900/60 text-slate-200 ring-slate-700/60 hover:ring-amber-400/40'
          if (revealed && correct) cls = 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/40'
          else if (revealed && isPicked && !correct) cls = 'bg-rose-500/15 text-rose-200 ring-rose-400/40'
          else if (revealed) cls = 'bg-slate-900/40 text-slate-400 ring-slate-700/40'
          return (
            <span key={i} className="inline-flex items-center">
              <button
                type="button"
                onClick={() => setPicked(i)}
                aria-label={`Choose ${opt}`}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${cls}`}
              >
                {opt}
                {revealed && correct && <Check size={15} aria-hidden="true" />}
                {revealed && isPicked && !correct && <X size={15} aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() => speak(opt, { rate })}
                aria-label={`Speak ${opt}`}
                className="ml-1 rounded-md p-2 text-slate-500 transition hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <Volume2 size={14} />
              </button>
            </span>
          )
        })}
      </div>
      {picked !== null && (
        <p className="text-xs text-slate-400">
          {picked === answer
            ? 'Correct.'
            : `The answer is "${options[answer] ?? '—'}". Tap to try again or hear them.`}
        </p>
      )}
    </div>
  )
}
