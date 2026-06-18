/**
 * One node on the lesson path. Visual state encodes progression: done (emerald
 * check), current (amber ring + "Start here"), unlocked (open), or locked (muted
 * with a lock + the prereq hint). A connector line is drawn between nodes to make
 * the path read as a continuous journey.
 */

import { motion } from 'framer-motion'
import { Check, Lock } from 'lucide-react'
import { KIND_META, type LessonNode } from './lessonGraph'

interface LessonRowProps {
  node: LessonNode
  index: number
  isLast: boolean
  onOpen: (id: string) => void
}

export function LessonRow({ node, index, isLast, onOpen }: LessonRowProps) {
  const { lesson, status } = node
  const meta = KIND_META[lesson.kind]
  const Icon = meta.icon

  const done = status === 'done'
  const current = status === 'current'
  const locked = status === 'locked'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.4) }}
      className="relative flex gap-3"
    >
      {/* Node marker + connector */}
      <div className="flex flex-col items-center">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ${
            done
              ? 'bg-emerald-500/20 text-emerald-300 ring-emerald-400/40'
              : current
                ? 'bg-amber-400/20 text-amber-300 ring-amber-400/50'
                : locked
                  ? 'bg-slate-800/60 text-slate-500 ring-slate-700/60'
                  : 'bg-slate-800 text-slate-300 ring-slate-600/60'
          }`}
          aria-hidden="true"
        >
          {done ? <Check size={18} /> : locked ? <Lock size={15} /> : <Icon size={16} />}
        </span>
        {!isLast && (
          <span
            className={`my-1 w-0.5 flex-1 ${done ? 'bg-emerald-400/30' : 'bg-slate-700/50'}`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Card */}
      <button
        type="button"
        onClick={() => onOpen(lesson.id)}
        aria-label={`${lesson.title}. ${meta.label}. ${
          done ? 'Completed.' : current ? 'Start here.' : locked ? 'Locked.' : 'Available.'
        }`}
        className={`mb-3 flex flex-1 flex-col gap-1 rounded-2xl p-4 text-left ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 ${
          current
            ? 'bg-slate-800/80 ring-amber-400/50 hover:ring-amber-300/70'
            : locked
              ? 'bg-slate-900/40 ring-slate-800 hover:ring-slate-700'
              : 'bg-slate-800/50 ring-slate-700/60 hover:ring-slate-500/60'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
            {meta.label}
          </span>
          {current && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-900">
              Start here
            </span>
          )}
        </span>
        <span className={`text-base font-semibold ${locked ? 'text-slate-400' : 'text-slate-100'}`}>
          {lesson.title}
        </span>
        <span className="text-sm leading-snug text-slate-400">{lesson.goal}</span>
      </button>
    </motion.div>
  )
}
