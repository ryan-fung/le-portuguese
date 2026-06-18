import { describe, it, expect } from 'vitest'
import { review, isDue, msUntilDue, dueLabel, newCard, getScheduler } from './srs'

describe('srs wrapper', () => {
  it('getScheduler returns a stable instance', () => {
    expect(getScheduler()).toBe(getScheduler())
  })

  it('a fresh card is due immediately', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    expect(isDue(newCard(now), now)).toBe(true)
  })

  it('review advances the card and pushes the due date into the future', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    const card = newCard(now)
    const next = review(card, 'good', now)

    // reps increments, and the next due date is strictly after the review time.
    expect(next.reps).toBe(card.reps + 1)
    expect(msUntilDue(next, now)).toBeGreaterThan(0)
    expect(isDue(next, now)).toBe(false)
  })

  it('does not mutate the input card', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    const card = newCard(now)
    const beforeReps = card.reps
    review(card, 'good', now)
    expect(card.reps).toBe(beforeReps)
  })

  it('"again" schedules sooner than "easy"', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    const card = newCard(now)
    const again = review(card, 'again', now)
    const easy = review(card, 'easy', now)
    expect(msUntilDue(again, now)).toBeLessThan(msUntilDue(easy, now))
  })

  it('isDue respects the comparison time', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    const next = review(newCard(now), 'easy', now)
    // Far enough in the future, the card becomes due again.
    const later = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 365)
    expect(isDue(next, now)).toBe(false)
    expect(isDue(next, later)).toBe(true)
  })

  it('survives a JSON round-trip (persisted card with string dates)', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    const next = review(newCard(now), 'good', now)
    const rehydrated = JSON.parse(JSON.stringify(next))
    // due is now a string; isDue/msUntilDue must still work.
    expect(typeof rehydrated.due).toBe('string')
    expect(isDue(rehydrated, now)).toBe(false)
    expect(msUntilDue(rehydrated, now)).toBeGreaterThan(0)
  })

  it('dueLabel reads "now" for an overdue card and a future label otherwise', () => {
    const now = new Date('2026-01-01T00:00:00Z')
    expect(dueLabel(newCard(now), now)).toBe('now')
    const next = review(newCard(now), 'easy', now)
    expect(dueLabel(next, now)).not.toBe('now')
  })
})
