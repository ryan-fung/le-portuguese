/**
 * Global app state, persisted to localStorage via Zustand's persist middleware.
 *
 * Holds learner progress: which phonemes/lessons have been studied, SRS review
 * cards (ts-fsrs), recent Reader inputs, and UI preferences. Kept deliberately
 * small and serializable — heavy domain logic lives in src/core.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createEmptyCard, type Card } from 'ts-fsrs'

export type RouteId = 'reader' | 'lab' | 'drills' | 'learn'
export type Theme = 'dark' | 'light'

export interface SrsCard {
  /** Composite id, e.g. 'phoneme:e-central' or 'drill:l-01'. */
  id: string
  card: Card
  lastReviewed?: number
}

interface AppState {
  // --- UI prefs ---
  route: RouteId
  theme: Theme
  showIpa: boolean
  showRespelling: boolean
  speechRate: number

  // --- Progress ---
  /** phoneme ids the learner has opened/studied at least once. */
  seenPhonemes: string[]
  /** lesson ids completed. */
  completedLessons: string[]
  /** recent Reader inputs (most-recent first, capped). */
  recentTexts: string[]

  // --- SRS ---
  srs: Record<string, SrsCard>

  // --- actions ---
  setRoute: (r: RouteId) => void
  setTheme: (t: Theme) => void
  toggleIpa: () => void
  toggleRespelling: () => void
  setSpeechRate: (r: number) => void
  markPhonemeSeen: (id: string) => void
  completeLesson: (id: string) => void
  addRecentText: (text: string) => void
  ensureCard: (id: string) => SrsCard
  updateCard: (id: string, card: Card) => void
}

const RECENT_CAP = 10

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      route: 'reader',
      theme: 'dark',
      showIpa: true,
      showRespelling: true,
      speechRate: 0.85,

      seenPhonemes: [],
      completedLessons: [],
      recentTexts: [],
      srs: {},

      setRoute: (route) => set({ route }),
      setTheme: (theme) => set({ theme }),
      toggleIpa: () => set((s) => ({ showIpa: !s.showIpa })),
      toggleRespelling: () => set((s) => ({ showRespelling: !s.showRespelling })),
      setSpeechRate: (speechRate) => set({ speechRate }),

      markPhonemeSeen: (id) =>
        set((s) => (s.seenPhonemes.includes(id) ? s : { seenPhonemes: [...s.seenPhonemes, id] })),

      completeLesson: (id) =>
        set((s) => (s.completedLessons.includes(id) ? s : { completedLessons: [...s.completedLessons, id] })),

      addRecentText: (text) =>
        set((s) => {
          const trimmed = text.trim()
          if (!trimmed) return s
          const next = [trimmed, ...s.recentTexts.filter((t) => t !== trimmed)].slice(0, RECENT_CAP)
          return { recentTexts: next }
        }),

      ensureCard: (id) => {
        const existing = get().srs[id]
        if (existing) return existing
        const fresh: SrsCard = { id, card: createEmptyCard() }
        set((s) => ({ srs: { ...s.srs, [id]: fresh } }))
        return fresh
      },

      updateCard: (id, card) =>
        set((s) => ({
          srs: { ...s.srs, [id]: { id, card, lastReviewed: Date.now() } },
        })),
    }),
    {
      name: 'le-portuguese-v1',
      partialize: (s) => ({
        theme: s.theme,
        showIpa: s.showIpa,
        showRespelling: s.showRespelling,
        speechRate: s.speechRate,
        seenPhonemes: s.seenPhonemes,
        completedLessons: s.completedLessons,
        recentTexts: s.recentTexts,
        srs: s.srs,
      }),
    },
  ),
)
