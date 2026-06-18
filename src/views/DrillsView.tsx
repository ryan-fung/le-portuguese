/**
 * Drills — short, spaced-repetition practice sessions for European Portuguese.
 *
 * Three phases: a start screen (what's due + ways to begin), the runner (one
 * drill per screen with a progress bar), and a summary. Sessions are kept short
 * and mobile-first; every answer reveals WHY before moving on. SRS lives in
 * @/lib/srs and is committed through the store via useDrillSession.
 */

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { stopSpeaking } from '@/lib/speech'
import { useDrillSession } from './drills/useDrillSession'
import type { SessionMode } from './drills/useDrillSession'
import { StartScreen } from './drills/StartScreen'
import { DrillCard } from './drills/DrillCard'
import { SummaryScreen } from './drills/SummaryScreen'

export function DrillsView() {
  const session = useDrillSession()
  const [lastMode, setLastMode] = useState<SessionMode | null>(null)

  function start(mode: SessionMode) {
    setLastMode(mode)
    session.start(mode)
  }

  function leave() {
    stopSpeaking()
    session.cancel()
  }

  // Phase 1: start screen
  if (!session.active) {
    return <StartScreen onStart={start} />
  }

  // Phase 3: summary
  if (session.finished) {
    return (
      <SummaryScreen
        results={session.results}
        onDone={leave}
        onAgain={() => {
          if (lastMode) start(lastMode)
          else leave()
        }}
      />
    )
  }

  // Phase 2: runner
  const current = session.current
  if (!current) {
    // Defensive: nothing to show (e.g. empty queue) — bail back to start.
    return <StartScreen onStart={start} />
  }

  const total = session.queue.length
  const position = session.index + 1
  const progress = Math.round((session.index / total) * 100)

  return (
    <div className="mx-auto flex min-h-full max-w-xl flex-col p-4 sm:p-6">
      {/* Header: exit + progress */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={leave}
          aria-label="Exit session"
          className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <ChevronLeft size={22} />
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-amber-400"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="w-12 text-right text-xs tabular-nums text-slate-500">
          {position}/{total}
        </span>
      </div>

      {/* One drill per screen */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.drill.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            <DrillCard entry={current} onGrade={(grade, correct) => session.grade(grade, correct)} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
