/**
 * European Portuguese text-to-speech via Web Speech API.
 *
 * Uses the browser's native pt-PT voice. On iOS/macOS, prompts users to download
 * the high-quality Siri Portuguese (Portugal) voice if not detected.
 */

export interface SpeechCapability {
  supported: boolean
  /** True when Web Speech API has a genuine pt-PT voice. */
  hasEuropeanVoice: boolean
  /** True when only low-quality or no pt-PT voice is available. */
  shouldPromptVoiceDownload: boolean
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

function hasPortugueseVoice(voices: SpeechSynthesisVoice[]): boolean {
  return voices.some((v) => v.lang.toLowerCase().startsWith('pt'))
}

function hasEuropeanPortugueseVoice(voices: SpeechSynthesisVoice[]): boolean {
  return voices.some((v) => v.lang.toLowerCase() === 'pt-pt')
}

export async function getSpeechCapability(): Promise<SpeechCapability> {
  if (typeof speechSynthesis === 'undefined') {
    return {
      supported: false,
      hasEuropeanVoice: false,
      shouldPromptVoiceDownload: true
    }
  }

  const voices = await loadVoices()
  const hasEP = hasEuropeanPortugueseVoice(voices)
  const hasPT = hasPortugueseVoice(voices)

  return {
    supported: voices.length > 0,
    hasEuropeanVoice: hasEP,
    shouldPromptVoiceDownload: !hasEP,
    voiceName: hasEP ? 'pt-PT (device default)' : hasPT ? 'pt-BR fallback' : undefined
  }
}

export interface SpeakOptions {
  rate?: number
  pitch?: number
  onEnd?: () => void
  onError?: (error: Error) => void
}

/** Speak a Portuguese word or passage using Web Speech API. */
export async function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  if (typeof speechSynthesis === 'undefined') return

  // Stop any currently playing speech
  stopSpeaking()

  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'pt-PT'  // Let device use its configured pt-PT voice
  utter.rate = opts.rate ?? 0.85
  utter.pitch = opts.pitch ?? 1

  if (opts.onEnd) utter.addEventListener('end', opts.onEnd)
  if (opts.onError) {
    utter.addEventListener('error', (e) => {
      opts.onError?.(new Error(`Speech synthesis error: ${e.error}`))
    })
  }

  speechSynthesis.speak(utter)
}

export function stopSpeaking(): void {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel()
  }
}
