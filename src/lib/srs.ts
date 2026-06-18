/**
 * Spaced-repetition scheduling for Lê, wrapping ts-fsrs.
 *
 * The rest of the app should never import ts-fsrs directly — it talks to this
 * module in terms of a small `Grade` vocabulary ('again' | 'hard' | 'good' |
 * 'easy') and plain `Card` values. That keeps the FSRS specifics (Rating enum,
 * scheduler construction, due-date semantics) contained in one place.
 *
 * Cards are persisted through the Zustand store, which means `card.due` and
 * `card.last_review` survive a JSON round-trip as ISO strings rather than Date
 * objects. Every function here coerces dates defensively so a rehydrated card
 * behaves the same as a fresh one.
 */

import { fsrs, generatorParameters, createEmptyCard, Rating, type Card, type FSRS } from 'ts-fsrs'

/** The four answer grades the UI works in. Maps 1:1 to the FSRS ratings. */
export type Grade = 'again' | 'hard' | 'good' | 'easy'

const GRADE_TO_RATING: Record<Grade, Rating.Again | Rating.Hard | Rating.Good | Rating.Easy> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
}

let scheduler: FSRS | null = null

/**
 * Get the shared FSRS scheduler, created lazily with default parameters.
 * Reusing one instance avoids rebuilding the (stateless) scheduler per review.
 */
export function getScheduler(): FSRS {
  if (!scheduler) scheduler = fsrs(generatorParameters())
  return scheduler
}

/** A brand-new, never-reviewed card. Thin re-export so views avoid ts-fsrs. */
export function newCard(now: Date = new Date()): Card {
  return createEmptyCard(now)
}

/**
 * Apply a review at `now` and return the next card state.
 * Pure with respect to the input card — does not mutate it.
 */
export function review(card: Card, grade: Grade, now: Date = new Date()): Card {
  const { card: next } = getScheduler().next(card, now, GRADE_TO_RATING[grade])
  return next
}

/** Normalise a possibly-stringified date (post-persistence) to epoch millis. */
function toMillis(due: Date | string | number): number {
  if (due instanceof Date) return due.getTime()
  return new Date(due).getTime()
}

/** True when the card is due for review at `now` (its due date has passed). */
export function isDue(card: Card, now: Date = new Date()): boolean {
  return toMillis(card.due) <= now.getTime()
}

/** Milliseconds until the card is next due; negative if already overdue. */
export function msUntilDue(card: Card, now: Date = new Date()): number {
  return toMillis(card.due) - now.getTime()
}

/**
 * A short, human label for when a card is next due, e.g. "now", "in 3 days".
 * Used in the session summary to tell the learner what comes back when.
 */
export function dueLabel(card: Card, now: Date = new Date()): string {
  const ms = msUntilDue(card, now)
  if (ms <= 0) return 'now'
  const mins = Math.round(ms / 60000)
  if (mins < 60) return `in ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `in ${hours} h`
  const days = Math.round(hours / 24)
  return `in ${days} day${days === 1 ? '' : 's'}`
}
