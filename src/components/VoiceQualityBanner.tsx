import { useEffect, useState } from 'react'
import { getSpeechCapability } from '../lib/speech'

const BANNER_DISMISSED_KEY = 'voiceQualityBannerDismissed'

export function VoiceQualityBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const checkVoiceQuality = async () => {
      // Check if already dismissed this session
      if (sessionStorage.getItem(BANNER_DISMISSED_KEY)) {
        return
      }

      const capability = await getSpeechCapability()
      if (capability.shouldPromptVoiceDownload) {
        setShow(true)
      }
    }

    checkVoiceQuality()
  }, [])

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="voice-quality-banner">
      <div className="voice-quality-banner__content">
        <p className="voice-quality-banner__text">
          <strong>Tip:</strong> For best pronunciation quality on iOS/macOS:
          <br />
          Settings → Accessibility → Spoken Content → Voices → Portuguese (Portugal) → Download Enhanced Voice
        </p>
        <button
          onClick={handleDismiss}
          className="voice-quality-banner__dismiss"
          aria-label="Dismiss voice quality tip"
        >
          ×
        </button>
      </div>
    </div>
  )
}
