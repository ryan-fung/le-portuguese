import { describe, it, expect } from 'vitest'
import { CURRICULUM, CURRICULUM_BY_ID, ALL_DRILLS } from './curriculum'
import { isPhonemeId } from '@/core/phoneme-ids'

describe('curriculum integrity', () => {
  it('every referenced phoneme id is valid', () => {
    for (const lesson of CURRICULUM) {
      for (const id of lesson.phonemeIds) {
        expect(isPhonemeId(id), `${lesson.id} references unknown phoneme ${id}`).toBe(true)
      }
    }
  })

  it('every lesson prerequisite resolves to an existing lesson', () => {
    for (const lesson of CURRICULUM) {
      for (const req of lesson.requires ?? []) {
        expect(CURRICULUM_BY_ID[req], `${lesson.id} requires unknown lesson ${req}`).toBeDefined()
      }
    }
  })

  it('lesson and drill ids are unique', () => {
    const lessonIds = CURRICULUM.map((l) => l.id)
    expect(new Set(lessonIds).size).toBe(lessonIds.length)
    const drillIds = ALL_DRILLS.map((d) => d.id)
    expect(new Set(drillIds).size).toBe(drillIds.length)
  })

  it('multiple-choice drills have a valid answer index', () => {
    for (const d of ALL_DRILLS) {
      if (d.options) {
        expect(d.answer, `${d.id} has options but no answer`).toBeTypeOf('number')
        expect(d.answer!).toBeGreaterThanOrEqual(0)
        expect(d.answer!).toBeLessThan(d.options.length)
      }
    }
  })

  it('prerequisites form a DAG (no cycles)', () => {
    const visiting = new Set<string>()
    const done = new Set<string>()
    const visit = (id: string, path: string[]): void => {
      if (done.has(id)) return
      expect(visiting.has(id), `cycle through ${[...path, id].join(' -> ')}`).toBe(false)
      visiting.add(id)
      for (const req of CURRICULUM_BY_ID[id]?.requires ?? []) visit(req, [...path, id])
      visiting.delete(id)
      done.add(id)
    }
    for (const l of CURRICULUM) visit(l.id, [])
  })
})
