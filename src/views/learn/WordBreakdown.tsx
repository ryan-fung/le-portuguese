/**
 * An inline, expandable breakdown of a single Portuguese example word. Collapsed
 * it's just the word with a speak button; expanded it shows the colour-coded
 * syllable/segment tiles (via analyze()) with IPA + respelling, mirroring the
 * Reader's visual language so the colours mean the same thing everywhere.
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, ChevronDown } from 'lucide-react'
import { analyze } from '@/core/g2p'
import { styleForSegment } from '@/lib/segmentStyle'
import { PHONEME_IDS } from '@/core/phoneme-ids'
import { speak } from '@/lib/speech'
import type { G2PSegment } from '@/core/types'
import { useStore } from '@/store'

function ipaFor(seg: G2PSegment): string {
  if (!seg.phonemeId) return ''
  return PHONEME_IDS[seg.phonemeId as keyof typeof PHONEME_IDS]?.ipa ?? ''
}

export function WordBreakdown({ word }: { word: string }) {
  const [open, setOpen] = useState(false)
  const rate = useStore((s) => s.speechRate)
  const analysis = analyze(word)

  return (
    <div className="rounded-xl bg-slate-900/50 ring-1 ring-slate-700/50">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex items-center gap-2 rounded-md text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <ChevronDown
            size={16}
            className={`text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
          <span className="text-base font-medium text-slate-100">{analysis.input}</span>
          {analysis.respelling && (
            <span className="text-xs text-slate-400">{analysis.respelling}</span>
          )}
        </button>
        <button
          type="button"
          onClick={() => speak(analysis.input, { rate })}
          aria-label={`Speak ${analysis.input}`}
          className="rounded-md p-2 text-slate-400 transition hover:bg-slate-800 hover:text-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Volume2 size={16} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-end gap-1.5 px-3 pb-3 pt-1">
              {analysis.syllables.map((syllable, si) => (
                <span
                  key={si}
                  className={`flex gap-0.5 rounded-md pb-1 ${
                    syllable.stressed ? 'border-b-2 border-amber-400' : 'border-b-2 border-transparent'
                  }`}
                  title={syllable.stressed ? 'Stressed syllable' : undefined}
                >
                  {syllable.segments.map((seg, gi) => {
                    const style = styleForSegment(seg)
                    return (
                      <span
                        key={gi}
                        title={style.label}
                        className={`flex min-h-[44px] min-w-[28px] flex-col items-center justify-center rounded-md px-1.5 py-1 ${style.className}`}
                      >
                        <span className="text-base font-semibold leading-none">{seg.grapheme}</span>
                        {!seg.silent && (
                          <span className="mt-1 flex flex-col items-center leading-tight">
                            {seg.phonemeId && (
                              <span className="ipa text-[11px] opacity-90">{ipaFor(seg)}</span>
                            )}
                            {seg.respelling && (
                              <span className="text-[10px] text-slate-400">{seg.respelling}</span>
                            )}
                          </span>
                        )}
                      </span>
                    )
                  })}
                </span>
              ))}
              {analysis.ipa && (
                <span className="ipa self-center pl-1 text-xs text-slate-500">/{analysis.ipa}/</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
