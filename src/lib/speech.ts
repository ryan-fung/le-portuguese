/**
 * European Portuguese text-to-speech via the Web Speech API.
 *
 * Browser support for a genuine pt-PT voice is uneven: desktop Safari/Chrome on
 * macOS ship "Joana"/"Catarina", but many Android and Windows devices only have
 * a pt-BR voice or none. We pick the best available pt-* voice, preferring
 * pt-PT, and expose whether a true EP voice was found so the UI can warn the
 * learner that the accent may sound Brazilian.
 */

export interface SpeechCapability {
  supported: boolean
  /** True when an actual pt-PT voice is available (not just pt-BR fallback). */
  hasEuropeanVoice: boolean
  voiceName?: string
}

let cachedVoices: SpeechSynthesisVoice[] = []

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof speechSynthesis === 'undefined') return resolve([])
    const existing = speechSynthesis.getVoices()
    if (existing.length) {
      cachedVoices = existing
      return resolve(existing)
    }
    const handler = () => {
      cachedVoices = speechSynthesis.getVoices()
      resolve(cachedVoices)
    }
    speechSynthesis.addEventListener('voiceschanged', handler, { once: true })
    // Safety timeout: some browsers never fire the event.
    setTimeout(() => resolve(speechSynthesis.getVoices()), 500)
  })
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const pt = voices.filter((v) => v.lang.toLowerCase().startsWith('pt'))
  // Prefer European Portuguese, then any Portuguese.
  return (
    pt.find((v) => v.lang.toLowerCase() === 'pt-pt') ??
    pt.find((v) => v.lang.toLowerCase().includes('pt')) ??
    undefined
  )
}

export async function getSpeechCapability(): Promise<SpeechCapability> {
  if (typeof speechSynthesis === 'undefined') {
    return { supported: false, hasEuropeanVoice: false }
  }
  const voices = await loadVoices()
  const voice = pickVoice(voices)
  return {
    supported: true,
    hasEuropeanVoice: !!voice && voice.lang.toLowerCase() === 'pt-pt',
    voiceName: voice?.name,
  }
}

export interface SpeakOptions {
  rate?: number
  pitch?: number
  onEnd?: () => void
}

/** Speak a Portuguese word or passage. Cancels any in-flight utterance first. */
export function speak(text: string, opts: SpeakOptions = {}): void {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(cachedVoices.length ? cachedVoices : speechSynthesis.getVoices())
  if (voice) utter.voice = voice
  utter.lang = voice?.lang ?? 'pt-PT'
  utter.rate = opts.rate ?? 0.85
  utter.pitch = opts.pitch ?? 1
  if (opts.onEnd) utter.addEventListener('end', opts.onEnd)
  speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel()
}
