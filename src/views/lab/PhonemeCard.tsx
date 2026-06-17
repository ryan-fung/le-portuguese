/**
 * A single phoneme tile in the Sound Lab grid. Shows the big IPA glyph and the
 * human name; signature-EP sounds get an amber star badge since they're the
 * sounds that most define the European Portuguese accent. A subtle dot marks
 * sounds the learner has already explored.
 */

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Phoneme } from '@/core/types'
import { tileColor } from './categories'

interface PhonemeCardProps {
  phoneme: Phoneme
  seen: boolean
  onOpen: (id: string) => void
}

export function PhonemeCard({ phoneme, seen, onOpen }: PhonemeCardProps) {
  const signature = !!phoneme.signatureEP

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      onClick={() => onOpen(phoneme.id)}
      aria-label={`${phoneme.name}${signature ? ', a signature European Portuguese sound' : ''}${
        seen ? ', explored' : ''
      }`}
      className={`group relative flex min-h-[7rem] flex-col items-center justify-center gap-1.5 rounded-2xl p-3 text-center ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${tileColor(
        phoneme,
      )} ${
        signature
          ? 'ring-amber-400/50 shadow-[0_0_0_1px_rgba(251,191,36,0.25)] hover:ring-amber-300/70'
          : 'hover:ring-slate-400/40'
      }`}
    >
      {signature && (
        <span
          className="absolute right-2 top-2 text-amber-400"
          title="Signature EP sound"
          aria-hidden="true"
        >
          <Star size={14} fill="currentColor" />
        </span>
      )}
      {seen && (
        <span
          className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-current opacity-50"
          aria-hidden="true"
        />
      )}
      <span className="ipa text-3xl font-semibold leading-none sm:text-4xl">{phoneme.ipa}</span>
      <span className="text-[11px] font-medium leading-tight text-slate-300/90 line-clamp-2">
        {phoneme.name}
      </span>
    </motion.button>
  )
}
