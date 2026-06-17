/**
 * Self-contained phoneme detail modal for the Reader. Opens when the learner
 * taps a coloured sound tile and shows the full teaching card for that phoneme:
 * the English anchor up front, a big IPA glyph, how to make the sound, example
 * words, and the contrasts learners confuse. Plays the bundled clip on demand.
 *
 * Keyboard-dismissible (Esc), focus-trapped to the close button on open, and
 * backdrop-click closes. Depends only on shared data/lib modules.
 */

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, X } from 'lucide-react'
import type { Phoneme } from '@/core/types'
import { getPhoneme } from '@/data/phonemes'

interface PhonemeModalProps {
  /** The phoneme id to show, or null when closed. */
  phonemeId: string | null
  onClose: () => void
  /** Plays the phoneme's bundled audio clip. */
  onPlay: (src: string) => void
}

export function PhonemeModal({ phonemeId, onClose, onPlay }: PhonemeModalProps) {
  const phoneme = phonemeId ? getPhoneme(phonemeId) : undefined
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!phoneme) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [phoneme, onClose])

  return (
    <AnimatePresence>
      {phoneme && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="presentation"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Sound detail: ${phoneme.name}`}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-slate-700 bg-slate-900 shadow-2xl sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalBody phoneme={phoneme} onClose={onClose} onPlay={onPlay} closeRef={closeRef} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ModalBody({
  phoneme,
  onClose,
  onPlay,
  closeRef,
}: {
  phoneme: Phoneme
  onClose: () => void
  onPlay: (src: string) => void
  closeRef: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => phoneme.audio && onPlay(phoneme.audio)}
            disabled={!phoneme.audio}
            aria-label={`Play the sound ${phoneme.ipa}`}
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 disabled:opacity-40"
          >
            <span className="ipa text-3xl leading-none">{phoneme.ipa}</span>
          </button>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{phoneme.name}</h2>
            {phoneme.signatureEP && (
              <span className="mt-1 inline-block rounded-full bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300 ring-1 ring-amber-400/20">
                Signature European Portuguese sound
              </span>
            )}
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <X size={20} />
        </button>
      </div>

      <p className="mt-5 rounded-lg bg-slate-800/60 p-4 text-base leading-relaxed text-slate-100">
        {phoneme.englishAnchor}
      </p>

      {phoneme.audio && (
        <button
          type="button"
          onClick={() => phoneme.audio && onPlay(phoneme.audio)}
          className="mt-3 flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          <Volume2 size={16} /> Play sound
        </button>
      )}

      <Section title="How to make it">
        <p className="text-sm leading-relaxed text-slate-300">{phoneme.howTo}</p>
        {phoneme.mnemonic && (
          <p className="mt-2 text-sm italic text-slate-400">{phoneme.mnemonic}</p>
        )}
      </Section>

      {phoneme.examples.length > 0 && (
        <Section title="Examples">
          <ul className="flex flex-wrap gap-2">
            {phoneme.examples.map((ex) => (
              <li
                key={ex.word}
                className="rounded-lg bg-slate-800/60 px-3 py-1.5 text-sm text-slate-200"
              >
                <span className="font-medium">{ex.word}</span>
                {ex.gloss && <span className="text-slate-500"> — {ex.gloss}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {phoneme.contrasts && phoneme.contrasts.length > 0 && (
        <Section title="Easy to confuse with">
          <ul className="flex flex-col gap-2">
            {phoneme.contrasts.map((c) => {
              const other = getPhoneme(c.withId)
              return (
                <li key={c.withId} className="rounded-lg bg-slate-800/40 p-3 text-sm">
                  <div className="flex items-baseline gap-2">
                    {other && <span className="ipa text-base text-amber-300">{other.ipa}</span>}
                    {c.pair && (
                      <span className="text-slate-400">
                        {c.pair[0]} / {c.pair[1]}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 leading-relaxed text-slate-300">{c.note}</p>
                </li>
              )
            })}
          </ul>
        </Section>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  )
}
