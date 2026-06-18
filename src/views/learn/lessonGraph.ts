/**
 * Pure helpers for the Learn path: derive each lesson's progression status from
 * the curriculum DAG and the learner's completed set. A lesson is "locked" until
 * every prerequisite in `requires` is completed; the first incomplete unlocked
 * lesson is the learner's current "next up".
 */

import { CURRICULUM } from '@/data/curriculum'
import type { Lesson, LessonKind } from '@/core/types'
import { AudioLines, SpellCheck, Scale, ScrollText, type LucideIcon } from 'lucide-react'

export type LessonStatus = 'done' | 'current' | 'unlocked' | 'locked'

export interface LessonNode {
  lesson: Lesson
  status: LessonStatus
  /** Prerequisite lessons not yet completed (drives the locked hint). */
  missing: Lesson[]
}

export function buildPath(completed: string[]): LessonNode[] {
  const done = new Set(completed)
  let currentAssigned = false

  return CURRICULUM.map((lesson) => {
    const missing = (lesson.requires ?? [])
      .filter((id) => !done.has(id))
      .map((id) => CURRICULUM.find((l) => l.id === id))
      .filter((l): l is Lesson => !!l)

    const locked = missing.length > 0
    let status: LessonStatus

    if (done.has(lesson.id)) {
      status = 'done'
    } else if (locked) {
      status = 'locked'
    } else if (!currentAssigned) {
      status = 'current'
      currentAssigned = true
    } else {
      status = 'unlocked'
    }

    return { lesson, status, missing }
  })
}

export const KIND_META: Record<LessonKind, { icon: LucideIcon; label: string }> = {
  sound: { icon: AudioLines, label: 'Sound' },
  'spelling-rule': { icon: SpellCheck, label: 'Spelling rule' },
  contrast: { icon: Scale, label: 'Contrast' },
  passage: { icon: ScrollText, label: 'Passage' },
}
