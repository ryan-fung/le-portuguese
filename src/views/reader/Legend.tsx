/**
 * Collapsible colour legend for the Reader. Explains what each tile colour
 * means using the shared SEGMENT_LEGEND so the colour language matches the
 * Sound Lab. Collapsed by default to keep the results uncluttered.
 */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { SEGMENT_LEGEND } from '@/lib/segmentStyle'

export function Legend() {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span>What do the colours mean?</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} />
        </motion.span>
      </button>
      {open && (
        <div className="flex flex-wrap gap-2 px-4 pb-4 pt-1">
          {SEGMENT_LEGEND.map((entry) => (
            <span
              key={entry.label}
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${entry.className}`}
            >
              {entry.label}
            </span>
          ))}
          <p className="mt-1 w-full text-xs text-slate-500">
            The <span className="font-medium text-slate-400">underlined</span> syllable carries the
            word stress. Tap any tile to hear the sound and learn how to make it.
          </p>
        </div>
      )}
    </div>
  )
}
