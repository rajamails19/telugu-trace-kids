import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'ttk-muted'
const MUTE_EVENT  = 'ttk-mute-change'

const isMuted = () => localStorage.getItem(STORAGE_KEY) === 'true'

/** Pick the best voice for Telugu text:
 *  1. An actual te-IN voice (ideal)
 *  2. Tamil (ta-IN) — closest Dravidian language with a local voice on most Macs
 *  3. Hindi (hi-IN) — Indian language fallback
 *  4. null → browser uses its default (will still produce audio)
 */
function pickVoice() {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang.startsWith('te'))   ||
    voices.find(v => v.lang.startsWith('ta'))   ||
    voices.find(v => v.lang.startsWith('hi'))   ||
    null
  )
}

/**
 * Fire Telugu audio — no mute check (used by the play button).
 * Strategy:
 *   1. Google Translate TTS (real Telugu pronunciation, no API key needed)
 *   2. Web Speech API with best available voice as fallback
 */
export function speakWord(telugu) {
  // Route through our Vite proxy to avoid CORS — same-origin request
  const url = `/api/tts?ie=UTF-8&q=${encodeURIComponent(telugu)}&tl=te&total=1&idx=0&textlen=${telugu.length}&client=tw-ob&ttsspeed=0.6`
  const audio = new Audio(url)
  audio.volume = 1

  audio.play().then(() => {
    console.log('[TTK] Telugu TTS playing ✓')
  }).catch((err) => {
    console.warn('[TTK] TTS failed:', err.message)
  })
}

export function useSpeech() {
  const [muted, setMuted] = useState(isMuted)

  // Keep all mounted instances (Header, WordCard, InteractiveCanvas…) in sync
  useEffect(() => {
    const h = (e) => setMuted(e.detail)
    window.addEventListener(MUTE_EVENT, h)
    return () => window.removeEventListener(MUTE_EVENT, h)
  }, [])

  const toggleMute = useCallback(() => {
    const next = !isMuted()
    localStorage.setItem(STORAGE_KEY, String(next))
    window.dispatchEvent(new CustomEvent(MUTE_EVENT, { detail: next }))
    setMuted(next)
  }, [])

  /** Speak word.telugu — respects the mute toggle */
  const speak = useCallback((word) => {
    if (isMuted() || !window.speechSynthesis) return
    speakWord(word.telugu)
  }, [])

  return { muted, toggleMute, speak }
}
