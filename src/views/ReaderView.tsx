/**
 * The Reader — paste any European Portuguese text and see exactly how to say it,
 * sound by sound. Tokenizes the input, runs each word through the EP G2P engine,
 * and renders colour-coded syllable tiles with IPA + English respelling. Tapping
 * a sound opens its teaching card; whole-passage and per-word audio is available
 * when the device has a Portuguese voice.
 */

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Square, Sparkles, Clock, ArrowRight } from 'lucide-react'
import { analyze } from '@/core/g2p'
import { getPhoneme } from '@/data/phonemes'
import type { WordAnalysis } from '@/core/types'
import { speak, stopSpeaking, getSpeechCapability, type SpeechCapability } from '@/lib/speech'
import { usePhonemeAudio } from '@/lib/usePhonemeAudio'
import { tokenize, hasNewline, type Token } from '@/lib/tokenize'
import { useStore } from '@/store'
import { EXAMPLE_PASSAGES } from './reader/examples'
import { PhonemeModal } from './reader/PhonemeModal'
import { Legend } from './reader/Legend'
import { WordCard } from './reader/WordCard'

interface RenderToken {
  token: Token
  /** Present for word tokens. */
  analysis?: WordAnalysis
}

export function ReaderView() {
  const showIpa = useStore((s) => s.showIpa)
  const showRespelling = useStore((s) => s.showRespelling)
  const toggleIpa = useStore((s) => s.toggleIpa)
  const toggleRespelling = useStore((s) => s.toggleRespelling)
  const speechRate = useStore((s) => s.speechRate)
  const setSpeechRate = useStore((s) => s.setSpeechRate)
  const recentTexts = useStore((s) => s.recentTexts)
  const addRecentText = useStore((s) => s.addRecentText)
  const markPhonemeSeen = useStore((s) => s.markPhonemeSeen)

  const [draft, setDraft] = useState('')
  /** The text currently being analysed/displayed (committed on "Read"). */
  const [text, setText] = useState('')
  const [selectedPhoneme, setSelectedPhoneme] = useState<string | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [capability, setCapability] = useState<SpeechCapability | null>(null)

  const { playOne, playSequence, stop: stopClips } = usePhonemeAudio()

  useEffect(() => {
    let active = true
    getSpeechCapability().then((cap) => {
      if (active) setCapability(cap)
    })
    return () => {
      active = false
    }
  }, [])

  // Stop any audio when leaving the view.
  useEffect(() => {
    return () => {
      stopSpeaking()
      stopClips()
    }
  }, [stopClips])

  const canSpeak = capability?.supported ?? false

  const renderTokens = useMemo<RenderToken[]>(() => {
    if (!text.trim()) return []
    return tokenize(text).map((token) =>
      token.kind === 'word' ? { token, analysis: analyze(token.text) } : { token },
    )
  }, [text])

  const handleRead = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    setDraft(value)
    setText(value)
    addRecentText(value)
  }

  const handleSelectSegment = (phonemeId: string) => {
    markPhonemeSeen(phonemeId)
    setSelectedPhoneme(phonemeId)
  }

  const handleSpeakWord = (word: string) => {
    stopClips()
    speak(word, { rate: speechRate })
  }

  const handlePlaySounds = (analysis: WordAnalysis) => {
    stopSpeaking()
    const srcs = analysis.segments
      .filter((seg) => seg.phonemeId && !seg.silent)
      .map((seg) => getPhoneme(seg.phonemeId as string)?.audio)
      .filter((src): src is string => !!src)
    if (srcs.length) void playSequence(srcs, 280)
  }

  const handleReadPassage = () => {
    if (!text.trim()) return
    stopClips()
    setSpeaking(true)
    speak(text, { rate: speechRate, onEnd: () => setSpeaking(false) })
  }

  const handleStop = () => {
    stopSpeaking()
    stopClips()
    setSpeaking(false)
  }

  const hasResults = renderTokens.length > 0

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <Header />

      <Composer
        draft={draft}
        onDraftChange={setDraft}
        onRead={handleRead}
        recentTexts={recentTexts}
      />

      {capability && capability.supported && !capability.hasEuropeanVoice && (
        <SpeechBanner voiceName={capability.voiceName} />
      )}

      {hasResults ? (
        <>
          <Controls
            showIpa={showIpa}
            showRespelling={showRespelling}
            onToggleIpa={toggleIpa}
            onToggleRespelling={toggleRespelling}
            speechRate={speechRate}
            onRateChange={setSpeechRate}
            canSpeak={canSpeak}
            speaking={speaking}
            onReadPassage={handleReadPassage}
            onStop={handleStop}
          />
          <Legend />
          <Results
            renderTokens={renderTokens}
            showIpa={showIpa}
            showRespelling={showRespelling}
            canSpeak={canSpeak}
            onSpeakWord={handleSpeakWord}
            onPlaySounds={handlePlaySounds}
            onSelectSegment={handleSelectSegment}
          />
        </>
      ) : (
        <EmptyState onLoadExample={handleRead} />
      )}

      <PhonemeModal
        phonemeId={selectedPhoneme}
        onClose={() => setSelectedPhoneme(null)}
        onPlay={playOne}
      />
    </div>
  )
}

function Header() {
  return (
    <header className="flex flex-col gap-1">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-100">
        <Sparkles className="text-amber-400" size={22} /> Reader
      </h1>
      <p className="text-sm text-slate-400">
        Paste any Portuguese text and see exactly how to say it — sound by sound, the European way.
      </p>
    </header>
  )
}

function Composer({
  draft,
  onDraftChange,
  onRead,
  recentTexts,
}: {
  draft: string
  onDraftChange: (v: string) => void
  onRead: (v: string) => void
  recentTexts: string[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <textarea
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        placeholder="Escreve ou cola texto em português…"
        rows={3}
        aria-label="Portuguese text to read"
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-base text-slate-100 placeholder:text-slate-600 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/30"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onRead(draft)}
          disabled={!draft.trim()}
          className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Read it <ArrowRight size={16} />
        </button>
        {draft.trim() && (
          <button
            type="button"
            onClick={() => onDraftChange('')}
            className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            Clear
          </button>
        )}
      </div>

      {recentTexts.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500">
            <Clock size={12} /> Recent
          </span>
          <div className="flex flex-wrap gap-2">
            {recentTexts.slice(0, 6).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  onDraftChange(t)
                  onRead(t)
                }}
                className="max-w-[16rem] truncate rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs text-slate-300 transition hover:border-amber-400/40 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                title={t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SpeechBanner({ voiceName }: { voiceName?: string }) {
  return (
    <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-xs leading-relaxed text-amber-200/90">
      Your device has no European Portuguese voice
      {voiceName ? ` (it will use "${voiceName}")` : ''}, so spoken playback may sound Brazilian. The
      sound-by-sound breakdown below is still accurate European Portuguese.
    </div>
  )
}

function Controls({
  showIpa,
  showRespelling,
  onToggleIpa,
  onToggleRespelling,
  speechRate,
  onRateChange,
  canSpeak,
  speaking,
  onReadPassage,
  onStop,
}: {
  showIpa: boolean
  showRespelling: boolean
  onToggleIpa: () => void
  onToggleRespelling: () => void
  speechRate: number
  onRateChange: (r: number) => void
  canSpeak: boolean
  speaking: boolean
  onReadPassage: () => void
  onStop: () => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
      {canSpeak && (
        <div className="flex items-center gap-2">
          {speaking ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop reading"
              className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100 transition hover:bg-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Square size={15} /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={onReadPassage}
              aria-label="Read the whole passage aloud"
              className="flex items-center gap-2 rounded-lg bg-amber-400/15 px-3 py-2 text-sm font-medium text-amber-300 ring-1 ring-amber-400/30 transition hover:bg-amber-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <Play size={15} /> Read aloud
            </button>
          )}
        </div>
      )}

      <Toggle label="IPA" checked={showIpa} onChange={onToggleIpa} />
      <Toggle label="Respelling" checked={showRespelling} onChange={onToggleRespelling} />

      {canSpeak && (
        <label className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          Speed
          <input
            type="range"
            min={0.5}
            max={1.1}
            step={0.05}
            value={speechRate}
            onChange={(e) => onRateChange(Number(e.target.value))}
            aria-label="Speech speed"
            className="h-1 w-24 cursor-pointer accent-amber-400"
          />
          <span className="w-8 tabular-nums text-slate-500">{speechRate.toFixed(2)}×</span>
        </label>
      )}
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex items-center gap-2 text-sm text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
    >
      <span
        className={`flex h-5 w-9 items-center rounded-full p-0.5 transition ${
          checked ? 'bg-amber-400' : 'bg-slate-700'
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${checked ? 'translate-x-4' : ''}`}
        />
      </span>
      {label}
    </button>
  )
}

function Results({
  renderTokens,
  showIpa,
  showRespelling,
  canSpeak,
  onSpeakWord,
  onPlaySounds,
  onSelectSegment,
}: {
  renderTokens: RenderToken[]
  showIpa: boolean
  showRespelling: boolean
  canSpeak: boolean
  onSpeakWord: (word: string) => void
  onPlaySounds: (analysis: WordAnalysis) => void
  onSelectSegment: (phonemeId: string) => void
}) {
  let wordIndex = 0
  return (
    <div className="flex flex-wrap items-start gap-x-1.5 gap-y-3 leading-relaxed">
      {renderTokens.map((rt, i) => {
        if (rt.token.kind === 'other') {
          if (hasNewline(rt.token.text)) {
            return <span key={i} className="block w-full" aria-hidden="true" />
          }
          // Punctuation / numbers / symbols: render verbatim, non-interactive.
          return (
            <span key={i} className="self-center text-lg text-slate-500">
              {rt.token.text}
            </span>
          )
        }
        const analysis = rt.analysis
        // A word with no resolvable sounds (e.g. all silent / unknown): show plain.
        if (!analysis || analysis.syllables.length === 0) {
          return (
            <span key={i} className="self-center text-lg text-slate-400">
              {rt.token.text}
            </span>
          )
        }
        const idx = wordIndex++
        return (
          <WordCard
            key={i}
            analysis={analysis}
            showIpa={showIpa}
            showRespelling={showRespelling}
            canSpeak={canSpeak}
            onSpeakWord={onSpeakWord}
            onPlaySounds={onPlaySounds}
            onSelectSegment={onSelectSegment}
            index={idx}
          />
        )
      })}
    </div>
  )
}

function EmptyState({ onLoadExample }: { onLoadExample: (text: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/30 p-6"
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-slate-200">Start with an example</h2>
        <p className="text-sm leading-relaxed text-slate-400">
          Tap a passage to break it into colour-coded sounds. Each tile shows the letters, the IPA,
          and an English respelling so you can sound out any word — even one you have never seen.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {EXAMPLE_PASSAGES.map((ex) => (
          <button
            key={ex.label}
            type="button"
            onClick={() => onLoadExample(ex.text)}
            className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left transition hover:border-amber-400/40 hover:bg-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-400/80">
              {ex.label}
            </span>
            <span className="text-sm font-medium text-slate-100">{ex.text}</span>
            <span className="text-xs text-slate-500">{ex.gloss}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
