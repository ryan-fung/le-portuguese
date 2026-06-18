/**
 * The runner for a single drill. Renders one of four kinds, gives immediate
 * colour-coded feedback, and always reveals WHY (the G2P breakdown or the
 * contrast note) before the learner moves on.
 *
 *  - listen-discriminate: speak the correct word, pick which word it was.
 *  - sound-to-spell: show/play a phoneme, pick the word that contains it.
 *  - spell-to-sound: show a spelling, pick the matching sound.
 *  - read-aloud: read it yourself, hear the reference, self-grade.
 *
 * Multiple-choice grades map wrong→again / right→good automatically. Read-aloud
 * is self-graded (Again / Good / Easy).
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Ear, Volume2, X } from 'lucide-react'
import { speak, stopSpeaking } from '@/lib/speech'
import { usePhonemeAudio } from '@/lib/usePhonemeAudio'
import { getPhoneme } from '@/data/phonemes'
import { useStore } from '@/store'
import type { Grade } from '@/lib/srs'
import type { DrillEntry } from './drillData'
import { WordBreakdown } from './WordBreakdown'

interface DrillCardProps {
  entry: DrillEntry
  /** Called once the learner has graded this drill. */
  onGrade: (grade: Grade, correct: boolean) => void
}

export function DrillCard({ entry, onGrade }: DrillCardProps) {
  const { drill } = entry
  if (drill.kind === 'read-aloud') {
    return <ReadAloudCard entry={entry} onGrade={onGrade} />
  }
  return <ChoiceCard entry={entry} onGrade={onGrade} />
}

/** The phoneme spoken/shown for sound-to-spell prompts. */
function PromptPhoneme({ phonemeId }: { phonemeId: string }) {
  const phoneme = getPhoneme(phonemeId)
  const { playOne } = usePhonemeAudio()
  if (!phoneme) return null
  return (
    <button
      type="button"
      onClick={() => phoneme.audio && void playOne(phoneme.audio)}
      aria-label={`Hear the sound ${phoneme.name}`}
      className="mx-auto flex flex-col items-center gap-2 rounded-2xl bg-slate-800 px-8 py-6 ring-1 ring-slate-700 transition hover:ring-amber-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <span className="ipa text-5xl font-semibold text-amber-300">{phoneme.ipa}</span>
      <span className="flex items-center gap-1.5 text-xs text-slate-400">
        <Volume2 size={14} /> tap to replay
      </span>
      <span className="max-w-[16rem] text-center text-sm text-slate-300">{phoneme.englishAnchor}</span>
    </button>
  )
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

/** Shared card for the three multiple-choice kinds. */
function ChoiceCard({ entry, onGrade }: DrillCardProps) {
  const { drill, note } = entry
  const rate = useStore((s) => s.speechRate)
  const [picked, setPicked] = useState<number | null>(null)
  const options = drill.options ?? []
  const answer = drill.answer ?? 0
  const revealed = picked !== null
  const correct = picked === answer
  const correctWord = options[answer]

  const isListen = drill.kind === 'listen-discriminate'
  const isSoundToSpell = drill.kind === 'sound-to-spell'

  // Auto-play the target word for listen-discriminate when the drill mounts.
  const playedRef = useRef(false)
  useEffect(() => {
    playedRef.current = false
    setPicked(null)
  }, [drill.id])

  useEffect(() => {
    if (isListen && !playedRef.current) {
      playedRef.current = true
      const t = setTimeout(() => speak(correctWord, { rate }), 350)
      return () => clearTimeout(t)
    }
  }, [isListen, correctWord, rate])

  useEffect(() => () => stopSpeaking(), [])

  function choose(i: number) {
    if (revealed) return
    setPicked(i)
    const isRight = i === answer
    // Reinforce by playing the correct word for the audio-based kinds.
    if (isListen || isSoundToSpell) {
      setTimeout(() => speak(correctWord, { rate }), isRight ? 150 : 450)
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-center text-sm font-medium text-slate-400">{drill.prompt}</p>

      {/* Stimulus */}
      {isListen && (
        <button
          type="button"
          onClick={() => speak(correctWord, { rate })}
          aria-label="Replay the word"
          className="mx-auto flex items-center gap-3 rounded-2xl bg-amber-400/15 px-8 py-5 text-amber-200 ring-1 ring-amber-400/40 transition hover:bg-amber-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Ear size={28} />
          <span className="text-base font-medium">Play sound</span>
        </button>
      )}
      {isSoundToSpell && <PromptPhoneme phonemeId={drill.target} />}
      {!isListen && !isSoundToSpell && (
        <div className="mx-auto w-fit rounded-2xl bg-slate-800 px-8 py-5 text-center ring-1 ring-slate-700">
          <span className="text-3xl font-semibold text-slate-100">{drill.target}</span>
        </div>
      )}

      {/* Options */}
      <div className="grid gap-2.5" role="group" aria-label="Answer choices">
        {options.map((opt, i) => {
          const state = !revealed
            ? 'idle'
            : i === answer
              ? 'right'
              : i === picked
                ? 'wrong'
                : 'dim'
          const styles: Record<string, string> = {
            idle: 'bg-slate-800 text-slate-100 ring-slate-700 hover:ring-amber-400/50 hover:bg-slate-700/70',
            right: 'bg-emerald-500/20 text-emerald-100 ring-emerald-400/60',
            wrong: 'bg-rose-500/20 text-rose-100 ring-rose-400/60',
            dim: 'bg-slate-800/50 text-slate-500 ring-slate-800',
          }
          return (
            <motion.button
              key={`${drill.id}-${i}`}
              type="button"
              onClick={() => choose(i)}
              disabled={revealed}
              whileTap={revealed ? undefined : { scale: 0.98 }}
              aria-label={isListen ? `Choice ${OPTION_LETTERS[i]}: ${opt}` : opt}
              className={`flex items-center justify-between rounded-xl px-4 py-4 text-left text-lg font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${styles[state]}`}
            >
              <span className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">{OPTION_LETTERS[i]}</span>
                <span>{opt}</span>
              </span>
              {state === 'right' && <Check size={20} className="text-emerald-300" />}
              {state === 'wrong' && <X size={20} className="text-rose-300" />}
            </motion.button>
          )
        })}
      </div>

      {/* Reveal */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <p className={`text-sm font-semibold ${correct ? 'text-emerald-300' : 'text-rose-300'}`}>
            {correct ? 'Correct' : `Not quite — it was ${correctWord}`}
          </p>
          <WordBreakdown word={correctWord} />
          {note && <p className="border-t border-slate-800 pt-3 text-sm text-slate-400">{note}</p>}
          <button
            type="button"
            autoFocus
            onClick={() => onGrade(correct ? 'good' : 'again', correct)}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
          >
            Continue
          </button>
        </motion.div>
      )}
    </div>
  )
}

/** Read-aloud: learner reads, can hear reference + see breakdown, self-grades. */
function ReadAloudCard({ entry, onGrade }: DrillCardProps) {
  const { drill } = entry
  const rate = useStore((s) => s.speechRate)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
  }, [drill.id])

  useEffect(() => () => stopSpeaking(), [])

  const grades: { grade: Grade; label: string; hint: string; cls: string }[] = useMemo(
    () => [
      { grade: 'again', label: 'Again', hint: 'struggled', cls: 'bg-rose-500/20 text-rose-100 ring-rose-400/50 hover:bg-rose-500/30' },
      { grade: 'good', label: 'Good', hint: 'got it', cls: 'bg-emerald-500/20 text-emerald-100 ring-emerald-400/50 hover:bg-emerald-500/30' },
      { grade: 'easy', label: 'Easy', hint: 'nailed it', cls: 'bg-amber-400/20 text-amber-100 ring-amber-400/50 hover:bg-amber-400/30' },
    ],
    [],
  )

  return (
    <div className="space-y-5">
      <p className="text-center text-sm font-medium text-slate-400">{drill.prompt}</p>

      <div className="rounded-2xl bg-slate-800 px-6 py-7 text-center ring-1 ring-slate-700">
        <p className="text-2xl font-semibold leading-snug text-slate-100">{drill.target}</p>
      </div>

      <div className="flex justify-center gap-3">
        <button
          type="button"
          onClick={() => speak(drill.target, { rate })}
          className="flex items-center gap-2 rounded-xl bg-amber-400/15 px-5 py-3 text-sm font-medium text-amber-200 ring-1 ring-amber-400/40 transition hover:bg-amber-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <Volume2 size={18} /> Hear it
        </button>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="rounded-xl bg-slate-800 px-5 py-3 text-sm font-medium text-slate-200 ring-1 ring-slate-700 transition hover:ring-amber-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Show breakdown
          </button>
        )}
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <WordBreakdown word={drill.target} speakable={false} />
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <p className="text-center text-xs text-slate-500">How did your reading go?</p>
            <div className="grid grid-cols-3 gap-2">
              {grades.map((g) => (
                <button
                  key={g.grade}
                  type="button"
                  onClick={() => onGrade(g.grade, true)}
                  className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-3 text-sm font-semibold ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${g.cls}`}
                >
                  {g.label}
                  <span className="text-[10px] font-normal opacity-70">{g.hint}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
