/**
 * End-of-session recap: score for the multiple-choice drills, an encouraging
 * line, and a short "coming back soon" list built from the freshly-scheduled
 * SRS cards so the learner knows what to expect next.
 */

import { motion } from 'framer-motion'
import { RotateCcw, Trophy } from 'lucide-react'
import { useStore } from '@/store'
import { dueLabel } from '@/lib/srs'
import { cardId } from './drillData'
import type { DrillResult } from './useDrillSession'

interface SummaryScreenProps {
  results: DrillResult[]
  onDone: () => void
  onAgain: () => void
}

export function SummaryScreen({ results, onDone, onAgain }: SummaryScreenProps) {
  const srs = useStore((s) => s.srs)

  // Only multiple-choice drills contribute to an objective score.
  const scored = results.filter((r) => r.entry.drill.kind !== 'read-aloud')
  const correct = scored.filter((r) => r.correct).length
  const hasScore = scored.length > 0
  const pct = hasScore ? Math.round((correct / scored.length) * 100) : 0

  const headline = !hasScore
    ? 'Nice work'
    : pct === 100
      ? 'Perfect run'
      : pct >= 70
        ? 'Solid session'
        : 'Good practice — keep going'

  const now = new Date()
  const upcoming = results
    .map((r) => {
      const stored = srs[cardId(r.entry.drill)]
      return stored ? { label: r.entry.drill.target, when: dueLabel(stored.card, now) } : null
    })
    .filter((x): x is { label: string; when: string } => x !== null)
    .slice(0, 5)

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6 p-6 text-center sm:p-10">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40"
      >
        <Trophy size={36} />
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-100">{headline}</h2>
        <p className="text-sm text-slate-400">
          {results.length} drill{results.length === 1 ? '' : 's'} reviewed
          {hasScore && ` · ${correct}/${scored.length} correct`}
        </p>
      </div>

      {hasScore && (
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">{pct}%</p>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="w-full space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coming back</p>
          <ul className="space-y-1">
            {upcoming.map((u, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-200">{u.label}</span>
                <span className="text-slate-500">{u.when}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex w-full flex-col gap-2.5">
        <button
          type="button"
          autoFocus
          onClick={onDone}
          className="w-full rounded-xl bg-amber-400 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          Done
        </button>
        <button
          type="button"
          onClick={onAgain}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          <RotateCcw size={16} /> Another set
        </button>
      </div>
    </div>
  )
}
