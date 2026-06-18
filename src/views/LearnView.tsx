/**
 * Learn — the guided EP curriculum. Renders the lesson path (a DAG laid out as
 * an ordered journey, with locked/current/done states derived from completed
 * lessons) and, when a lesson is opened, its full detail screen with teaching
 * body, playable sounds, example breakdowns, practice drills, and completion.
 *
 * Locking is *soft*: prerequisites determine the visual state and the "start
 * here" pointer, but a curious learner can still open any lesson and read ahead
 * (with a gentle hint). Completing a lesson auto-advances to the next one so the
 * path keeps its forward momentum.
 */

import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import type { Lesson } from '@/core/types'
import { CURRICULUM } from '@/data/curriculum'
import { useStore } from '@/store'
import { buildPath } from './learn/lessonGraph'
import { LessonRow } from './learn/LessonRow'
import { LessonDetail } from './learn/LessonDetail'

export function LearnView() {
  const completedLessons = useStore((s) => s.completedLessons)
  const completeLesson = useStore((s) => s.completeLesson)
  const [openId, setOpenId] = useState<string | null>(null)

  const path = useMemo(() => buildPath(completedLessons), [completedLessons])
  const doneCount = completedLessons.filter((id) => CURRICULUM.some((l) => l.id === id)).length
  const total = CURRICULUM.length
  const pct = total ? Math.round((doneCount / total) * 100) : 0

  const openNode = openId ? path.find((n) => n.lesson.id === openId) ?? null : null

  function handleComplete(lesson: Lesson) {
    completeLesson(lesson.id)
    // Advance to the next not-yet-completed lesson, if any.
    const idx = CURRICULUM.findIndex((l) => l.id === lesson.id)
    const next = CURRICULUM.slice(idx + 1).find((l) => !completedLessons.includes(l.id))
    setOpenId(next ? next.id : null)
  }

  if (openNode) {
    return (
      <AnimatePresence mode="wait">
        <LessonDetail
          key={openNode.lesson.id}
          node={openNode}
          onBack={() => setOpenId(null)}
          onComplete={handleComplete}
        />
      </AnimatePresence>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <header className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-300/80">
          <GraduationCap size={15} aria-hidden="true" /> Learn
        </div>
        <h1 className="text-2xl font-semibold text-slate-100">Your reading path</h1>
        <p className="mt-1 text-slate-400">
          A graded path from the five vowels to reading real European Portuguese aloud.
        </p>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="font-medium text-slate-200">
              {doneCount} / {total} lessons
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-800"
            role="progressbar"
            aria-valuenow={doneCount}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label="Lessons completed"
          >
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      <div>
        {path.map((node, i) => (
          <LessonRow
            key={node.lesson.id}
            node={node}
            index={i}
            isLast={i === path.length - 1}
            onOpen={setOpenId}
          />
        ))}
      </div>
    </div>
  )
}
