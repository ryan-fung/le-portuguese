/**
 * The expanded lesson screen: goal, the teaching body (mini-markdown), the
 * playable sounds strip, the example words detected in the body, the practice
 * drills, and the completion action. Passage lessons get a prominent "Open in
 * Reader" button that hands the passage text off to the Reader view.
 */

import { motion } from 'framer-motion'
import { ArrowLeft, Check, BookOpen, Lock } from 'lucide-react'
import type { Lesson } from '@/core/types'
import { useStore } from '@/store'
import { MiniMarkdown } from '@/lib/miniMarkdown'
import { KIND_META, type LessonNode } from './lessonGraph'
import { SoundStrip } from './SoundStrip'
import { DrillList } from './DrillList'
import { WordBreakdown } from './WordBreakdown'
import { extractExamples } from './extractExamples'

interface LessonDetailProps {
  node: LessonNode
  onBack: () => void
  onComplete: (lesson: Lesson) => void
}

export function LessonDetail({ node, onBack, onComplete }: LessonDetailProps) {
  const { lesson, status, missing } = node
  const setRoute = useStore((s) => s.setRoute)
  const addRecentText = useStore((s) => s.addRecentText)
  const meta = KIND_META[lesson.kind]
  const Icon = meta.icon
  const done = status === 'done'
  const locked = status === 'locked'

  const examples = extractExamples(lesson)
  const passageText = lesson.kind === 'passage' ? lesson.drills.find((d) => d.kind === 'read-aloud')?.target : undefined

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto max-w-2xl px-4 py-6 sm:px-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 rounded-md py-1 text-sm text-slate-400 transition hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <ArrowLeft size={16} aria-hidden="true" /> Back to path
      </button>

      <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-300/80">
        <Icon size={14} aria-hidden="true" /> {meta.label}
      </div>
      <h1 className="text-2xl font-semibold text-slate-100">{lesson.title}</h1>
      <p className="mt-1 text-slate-400">{lesson.goal}</p>

      {locked && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-800/50 p-3 text-sm text-slate-300 ring-1 ring-slate-700/60">
          <Lock size={16} className="mt-0.5 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            This builds on{' '}
            <strong className="text-slate-100">{missing.map((m) => m.title).join(', ')}</strong>. You
            can read ahead, but finishing those first will make it click.
          </span>
        </div>
      )}

      <MiniMarkdown body={lesson.body} className="mt-5 text-[15px]" />

      {lesson.phonemeIds.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Sounds in this lesson
          </h2>
          <SoundStrip phonemeIds={lesson.phonemeIds} />
        </section>
      )}

      {examples.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Example words
          </h2>
          <div className="space-y-2">
            {examples.map((w) => (
              <WordBreakdown key={w} word={w} />
            ))}
          </div>
        </section>
      )}

      {lesson.kind === 'passage' && passageText && (
        <button
          type="button"
          onClick={() => {
            addRecentText(passageText)
            setRoute('reader')
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          <BookOpen size={18} aria-hidden="true" /> Open in Reader
        </button>
      )}

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Practice
        </h2>
        <DrillList drills={lesson.drills} />
      </section>

      <div className="mt-8 border-t border-slate-800 pt-5">
        {done ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 ring-1 ring-emerald-400/30">
            <Check size={18} aria-hidden="true" /> Lesson complete
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onComplete(lesson)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          >
            <Check size={18} aria-hidden="true" /> Mark complete
          </button>
        )}
      </div>
    </motion.div>
  )
}
