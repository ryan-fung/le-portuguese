/**
 * Sound Lab — the explorable reference of every European Portuguese sound.
 *
 * A "periodic table" of EP phonemes: a grouped, filterable grid that a learner
 * can browse, search and compare. Tapping a card opens an English-anchored
 * detail panel and marks the sound as explored, feeding the progress stat.
 */

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, Search, Sparkles, Star } from 'lucide-react'
import { PHONEMES, getPhoneme } from '@/data/phonemes'
import { useStore } from '@/store'
import { CATEGORIES, type CategoryId, groupPhonemes } from './categories'
import { PhonemeCard } from './PhonemeCard'
import { PhonemeDetail } from './PhonemeDetail'

export function LabView() {
  const seenPhonemes = useStore((s) => s.seenPhonemes)
  const markPhonemeSeen = useStore((s) => s.markPhonemeSeen)
  const seenSet = useMemo(() => new Set(seenPhonemes), [seenPhonemes])

  const [category, setCategory] = useState<CategoryId>('all')
  const [query, setQuery] = useState('')
  const [signatureOnly, setSignatureOnly] = useState(false)
  const [unseenOnly, setUnseenOnly] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const total = PHONEMES.length
  const exploredCount = useMemo(
    () => PHONEMES.filter((p) => seenSet.has(p.id)).length,
    [seenSet],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PHONEMES.filter((p) => {
      if (category !== 'all' && p.type !== category) return false
      if (signatureOnly && !p.signatureEP) return false
      if (unseenOnly && seenSet.has(p.id)) return false
      if (q) {
        const haystack = `${p.name} ${p.ipa} ${p.englishAnchor}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [category, query, signatureOnly, unseenOnly, seenSet])

  const groups = useMemo(() => groupPhonemes(filtered), [filtered])

  const open = (id: string) => {
    markPhonemeSeen(id)
    setOpenId(id)
  }

  const openPhoneme = openId ? getPhoneme(openId) ?? null : null

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Header + progress */}
      <header className="mb-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-100">
              <Sparkles size={22} className="text-amber-400" />
              Sound Lab
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Every European Portuguese sound, explained in plain English.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-amber-300">
              {exploredCount} / {total} explored
            </div>
            <div
              className="mt-1 h-1.5 w-32 overflow-hidden rounded-full bg-slate-800"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={exploredCount}
              aria-label="Sounds explored"
            >
              <motion.div
                className="h-full rounded-full bg-amber-400"
                initial={false}
                animate={{ width: `${(exploredCount / total) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a sound, name or English hint…"
          aria-label="Search sounds"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-400/60 focus:outline-none focus:ring-1 focus:ring-amber-400/60"
        />
      </div>

      {/* Category filters */}
      <div className="mb-3 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const active = category === c.id
          const count =
            c.id === 'all'
              ? PHONEMES.length
              : PHONEMES.filter((p) => p.type === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              aria-pressed={active}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                active
                  ? 'bg-amber-400/15 text-amber-200 ring-amber-400/50'
                  : 'bg-slate-900 text-slate-400 ring-slate-700 hover:text-slate-200 hover:ring-slate-600'
              }`}
            >
              {c.short}
              <span className="ml-1.5 text-slate-500">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Toggles */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSignatureOnly((v) => !v)}
          aria-pressed={signatureOnly}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            signatureOnly
              ? 'bg-amber-400/15 text-amber-200 ring-amber-400/50'
              : 'bg-slate-900 text-slate-400 ring-slate-700 hover:text-slate-200 hover:ring-slate-600'
          }`}
        >
          <Star size={13} fill={signatureOnly ? 'currentColor' : 'none'} />
          Signature EP only
        </button>
        <button
          onClick={() => setUnseenOnly((v) => !v)}
          aria-pressed={unseenOnly}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
            unseenOnly
              ? 'bg-amber-400/15 text-amber-200 ring-amber-400/50'
              : 'bg-slate-900 text-slate-400 ring-slate-700 hover:text-slate-200 hover:ring-slate-600'
          }`}
        >
          <Eye size={13} />
          Not yet seen
        </button>
        <span className="flex items-center px-1 text-xs text-slate-500">
          {filtered.length} {filtered.length === 1 ? 'sound' : 'sounds'}
        </span>
      </div>

      {/* Grid */}
      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 py-16 text-center text-sm text-slate-500">
          No sounds match these filters.
        </div>
      ) : (
        <motion.div layout className="space-y-7">
          {groups.map((group) => (
            <motion.section key={group.key} layout>
              <h2
                className={`mb-3 text-xs font-semibold uppercase tracking-wider ${group.accent}`}
              >
                {group.title}
                <span className="ml-2 text-slate-600">{group.phonemes.length}</span>
              </h2>
              <motion.div
                layout
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              >
                <AnimatePresence mode="popLayout">
                  {group.phonemes.map((p) => (
                    <PhonemeCard
                      key={p.id}
                      phoneme={p}
                      seen={seenSet.has(p.id)}
                      onOpen={open}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.section>
          ))}
        </motion.div>
      )}

      <PhonemeDetail phoneme={openPhoneme} onClose={() => setOpenId(null)} onJump={open} />
    </div>
  )
}
