/**
 * Collect the Portuguese example words worth offering an inline breakdown for.
 * Drill targets that are single words are the most reliable source; we also pull
 * words wrapped in *single asterisks* in the body (the curriculum's convention
 * for citing an example word). Phrases (with spaces) are skipped — they're
 * handled as read-aloud passages, not word breakdowns. Order-preserving + deduped.
 */

import type { Lesson } from '@/core/types'

const ITALIC = /\*([^*\s][^*]*?)\*/g

function isSingleWord(s: string): boolean {
  const t = s.trim()
  return t.length > 1 && !/\s/.test(t)
}

export function extractExamples(lesson: Lesson): string[] {
  const out: string[] = []
  const seen = new Set<string>()

  const push = (raw: string) => {
    const word = raw.trim().replace(/^[.,;:!?"'()]+|[.,;:!?"'()]+$/g, '')
    if (!isSingleWord(word)) return
    const key = word.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    out.push(word)
  }

  // Italicised example words in the body.
  for (const m of lesson.body.matchAll(ITALIC)) push(m[1])

  // Single-word drill targets (read-aloud words).
  for (const d of lesson.drills) {
    if (d.kind === 'read-aloud') push(d.target)
  }

  return out.slice(0, 8)
}
