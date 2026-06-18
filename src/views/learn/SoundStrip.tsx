/**
 * The "sounds in this lesson" strip: one playable card per phonemeId. Tapping a
 * card plays its bundled clip and marks the phoneme as seen (so it shows up as
 * explored in the Sound Lab). Cards show the big IPA glyph, the human name, and
 * the English anchor so a learner who doesn't know IPA still gets a foothold.
 */

import { Volume2 } from 'lucide-react'
import { getPhoneme } from '@/data/phonemes'
import { usePhonemeAudio } from '@/lib/usePhonemeAudio'
import { useStore } from '@/store'

export function SoundStrip({ phonemeIds }: { phonemeIds: string[] }) {
  const { playOne } = usePhonemeAudio()
  const markPhonemeSeen = useStore((s) => s.markPhonemeSeen)
  const seenPhonemes = useStore((s) => s.seenPhonemes)

  const phonemes = phonemeIds.map(getPhoneme).filter((p) => !!p)
  if (phonemes.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {phonemes.map((p) => {
        const seen = seenPhonemes.includes(p.id)
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              if (p.audio) void playOne(p.audio)
              markPhonemeSeen(p.id)
            }}
            aria-label={`Play the sound ${p.name}${seen ? ', explored' : ''}`}
            className="group flex items-center gap-3 rounded-xl bg-slate-800/60 p-3 text-left ring-1 ring-slate-700/60 transition hover:ring-amber-400/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <span
              className={`ipa flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-2xl font-semibold ${
                p.signatureEP
                  ? 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-400/40'
                  : 'bg-slate-900/60 text-slate-100'
              }`}
            >
              {p.ipa}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-slate-100">{p.name}</span>
                <Volume2
                  size={14}
                  className="shrink-0 text-slate-500 transition group-hover:text-amber-300"
                  aria-hidden="true"
                />
              </span>
              <span className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-400">
                {p.englishAnchor}
              </span>
            </span>
            {seen && (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400/70"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
