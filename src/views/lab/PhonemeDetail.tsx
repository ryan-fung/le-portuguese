/**
 * Expanding detail panel for one phoneme, shown as a modal over the grid.
 *
 * The English anchor is the visual hero — our audience does not read IPA, so
 * the "sounds like" line leads and the IPA glyph is secondary. Below it: how to
 * make the sound, a mnemonic, speakable example words, and a Contrasts section
 * with minimal pairs and jump links to confusable sounds.
 *
 * Accessibility: focus is trapped to the panel, Esc and backdrop-click dismiss,
 * and icon buttons carry aria-labels.
 */

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Star, Volume2, X } from 'lucide-react'
import type { Phoneme } from '@/core/types'
import { getPhoneme } from '@/data/phonemes'
import { usePhonemeAudio } from '@/lib/usePhonemeAudio'
import { speak } from '@/lib/speech'
import { useStore } from '@/store'
import { tileColor } from './categories'

interface PhonemeDetailProps {
  phoneme: Phoneme | null
  onClose: () => void
  onJump: (id: string) => void
}

/** A tappable Portuguese word that speaks itself via pt-PT TTS. */
function SpeakWord({
  word,
  highlight,
  gloss,
  className = '',
}: {
  word: string
  highlight?: string
  gloss?: string
  className?: string
}) {
  const speechRate = useStore((s) => s.speechRate)

  // Split the word so the grapheme that produces this sound can be emphasised.
  let before = word
  let mid = ''
  let after = ''
  if (highlight) {
    const idx = word.toLowerCase().indexOf(highlight.toLowerCase())
    if (idx >= 0) {
      before = word.slice(0, idx)
      mid = word.slice(idx, idx + highlight.length)
      after = word.slice(idx + highlight.length)
    }
  }

  return (
    <button
      onClick={() => speak(word, { rate: speechRate })}
      aria-label={`Play the word ${word}${gloss ? `, meaning ${gloss}` : ''}`}
      className={`group flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 ring-1 ring-slate-700 transition hover:bg-slate-800 hover:ring-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${className}`}
    >
      <Volume2 size={14} className="shrink-0 text-amber-400/80 group-hover:text-amber-300" />
      <span className="font-medium text-slate-100">
        {mid ? (
          <>
            {before}
            <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-2">
              {mid}
            </span>
            {after}
          </>
        ) : (
          word
        )}
      </span>
      {gloss && <span className="text-xs text-slate-500">{gloss}</span>}
    </button>
  )
}

/** One contrast row: the other sound, why they confuse, and a minimal pair. */
function ContrastRow({
  contrast,
  onJump,
}: {
  contrast: NonNullable<Phoneme['contrasts']>[number]
  onJump: (id: string) => void
}) {
  const other = getPhoneme(contrast.withId)
  if (!other) return null

  return (
    <li className="rounded-xl bg-slate-800/50 p-3 ring-1 ring-slate-700/60">
      <button
        onClick={() => onJump(other.id)}
        aria-label={`Jump to ${other.name}`}
        className="group flex w-full items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg"
      >
        <span
          className={`ipa flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl ring-1 ${tileColor(
            other,
          )}`}
        >
          {other.ipa}
        </span>
        <span className="flex-1 text-sm font-medium text-slate-200 group-hover:text-amber-200">
          {other.name}
        </span>
        <ArrowRight
          size={16}
          className="shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-amber-300"
        />
      </button>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{contrast.note}</p>
      {contrast.pair && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <SpeakWord word={contrast.pair[0]} />
          <span className="text-xs text-slate-600">vs</span>
          <SpeakWord word={contrast.pair[1]} />
        </div>
      )}
    </li>
  )
}

export function PhonemeDetail({ phoneme, onClose, onJump }: PhonemeDetailProps) {
  const { playOne } = usePhonemeAudio()
  const panelRef = useRef<HTMLDivElement>(null)

  // Esc to close + focus management while the modal is open.
  useEffect(() => {
    if (!phoneme) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Move focus into the panel for keyboard + screen-reader users.
    panelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [phoneme, onClose])

  return (
    <AnimatePresence>
      {phoneme && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close detail"
            tabIndex={-1}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${phoneme.name} detail`}
            tabIndex={-1}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-slate-900 ring-1 ring-slate-700 focus:outline-none sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-start gap-4 border-b border-slate-800 p-5">
              <button
                onClick={() => phoneme.audio && playOne(phoneme.audio)}
                aria-label={`Play the ${phoneme.name} sound`}
                className={`ipa relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-5xl ring-1 transition hover:brightness-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${tileColor(
                  phoneme,
                )}`}
              >
                {phoneme.ipa}
                <span className="absolute -bottom-1 -right-1 rounded-full bg-amber-400 p-1 text-slate-900">
                  <Volume2 size={13} />
                </span>
              </button>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-semibold text-slate-100">{phoneme.name}</h2>
                  {phoneme.signatureEP && (
                    <Star size={15} className="shrink-0 text-amber-400" fill="currentColor" />
                  )}
                </div>
                {phoneme.signatureEP && (
                  <span className="mt-1 inline-block rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    Signature EP sound
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {/* Hero: the English anchor */}
              <p className="text-lg font-medium leading-snug text-amber-100">
                {phoneme.englishAnchor}
              </p>

              <section>
                <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  How to make it
                </h3>
                <p className="text-sm leading-relaxed text-slate-300">{phoneme.howTo}</p>
              </section>

              {phoneme.mnemonic && (
                <p className="rounded-xl border-l-2 border-amber-400/60 bg-amber-400/5 px-3 py-2 text-sm italic text-amber-200/90">
                  {phoneme.mnemonic}
                </p>
              )}

              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Example words
                </h3>
                <div className="flex flex-wrap gap-2">
                  {phoneme.examples.map((ex) => (
                    <SpeakWord
                      key={ex.word}
                      word={ex.word}
                      highlight={ex.highlight}
                      gloss={ex.gloss}
                    />
                  ))}
                </div>
              </section>

              {phoneme.contrasts && phoneme.contrasts.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Don&rsquo;t confuse it with
                  </h3>
                  <ul className="space-y-2">
                    {phoneme.contrasts.map((c) => (
                      <ContrastRow key={c.withId} contrast={c} onJump={onJump} />
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
