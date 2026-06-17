/**
 * Phoneme audio playback. Each phoneme has a bundled audio clip under
 * /audio/<id>.mp3. We play clips through a single reused HTMLAudioElement and
 * support sequencing a list of clips (with a gap) for "play the word sound by
 * sound" — the fallback when no pt-PT TTS voice is available.
 */

import { useCallback, useRef } from 'react'

export function usePhonemeAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const cancelledRef = useRef(false)

  const getEl = () => {
    if (!audioRef.current) audioRef.current = new Audio()
    return audioRef.current
  }

  const playOne = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const el = getEl()
      el.onended = null
      el.src = src
      const done = () => {
        el.removeEventListener('ended', done)
        el.removeEventListener('error', done)
        resolve()
      }
      el.addEventListener('ended', done, { once: true })
      // Resolve (don't hang) if the clip is missing.
      el.addEventListener('error', done, { once: true })
      el.currentTime = 0
      void el.play().catch(() => done())
    })
  }, [])

  /** Play a sequence of clips with a gap (ms) between each. */
  const playSequence = useCallback(
    async (srcs: string[], gapMs = 250): Promise<void> => {
      cancelledRef.current = false
      for (const src of srcs) {
        if (cancelledRef.current) break
        await playOne(src)
        if (cancelledRef.current) break
        if (gapMs > 0) await new Promise((r) => setTimeout(r, gapMs))
      }
    },
    [playOne],
  )

  const stop = useCallback(() => {
    cancelledRef.current = true
    const el = audioRef.current
    if (el) {
      el.pause()
      el.currentTime = 0
    }
  }, [])

  return { playOne, playSequence, stop }
}
