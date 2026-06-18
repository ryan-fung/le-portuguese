/**
 * The Drills start screen: a calm hub that shows what's due and offers a few
 * ways to start a session — "Due now", "Quick 10", a warm-up of everything, or
 * a specific lesson / the auto-generated minimal-pairs set.
 */

import { motion } from 'framer-motion'
import { Headphones, Layers, Sparkles, Zap } from 'lucide-react'
import { useDrillStats } from './useDrillSession'
import type { SessionMode } from './useDrillSession'
import { allDrillEntries, groupEntries } from './drillData'
import { DEFAULT_QUICK } from './useDrillSession'

interface StartScreenProps {
  onStart: (mode: SessionMode) => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  const stats = useDrillStats()
  const groups = groupEntries(allDrillEntries())

  return (
    <div className="mx-auto max-w-xl space-y-6 p-5 sm:p-8">
      <header className="space-y-1">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-100">
          <Headphones size={24} className="text-amber-400" /> Drills
        </h1>
        <p className="text-sm text-slate-400">
          Short, focused practice. Listening contrasts, sound-spelling, and reading aloud — scheduled so the
          tricky ones come back more often.
        </p>
      </header>

      {/* Due summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <div>
          <p className="text-4xl font-bold text-amber-400">{stats.due}</p>
          <p className="text-sm text-slate-400">due to review now</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>{stats.started} started</p>
          <p>{stats.total} total drills</p>
        </div>
      </motion.div>

      {/* Primary actions */}
      <div className="grid gap-3 sm:grid-cols-2">
        <PrimaryButton
          icon={<Zap size={20} />}
          title="Due now"
          subtitle={stats.due > 0 ? `${stats.due} waiting` : 'all caught up'}
          disabled={stats.due === 0}
          onClick={() => onStart({ kind: 'due' })}
        />
        <PrimaryButton
          icon={<Sparkles size={20} />}
          title={`Quick ${DEFAULT_QUICK}`}
          subtitle="a fast mixed set"
          onClick={() => onStart({ kind: 'quick', size: DEFAULT_QUICK })}
        />
      </div>

      {/* By lesson / category */}
      <section className="space-y-2">
        <h2 className="flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Layers size={14} /> Practice a topic
        </h2>
        <div className="grid gap-2">
          {groups.map((g) => (
            <button
              key={g.source}
              type="button"
              onClick={() => onStart({ kind: 'lesson', source: g.source, label: g.label })}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-left transition hover:border-amber-400/40 hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <span className="text-sm font-medium text-slate-200">{g.label}</span>
              <span className="text-xs text-slate-500">{g.entries.length} drills</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

interface PrimaryButtonProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  disabled?: boolean
  onClick: () => void
}

function PrimaryButton({ icon, title, subtitle, disabled, onClick }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-left transition hover:bg-amber-400/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-not-allowed disabled:border-slate-800 disabled:bg-slate-900/40 disabled:text-slate-600"
    >
      <span className="text-amber-300">{icon}</span>
      <span>
        <span className="block text-base font-semibold text-slate-100">{title}</span>
        <span className="block text-xs text-slate-400">{subtitle}</span>
      </span>
    </button>
  )
}
