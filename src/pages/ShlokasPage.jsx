/**
 * ShlokasPage.jsx — Telugu Shlokas / Padyalu for kids
 *
 * Karaoke chanting system:
 *   1. User clicks Play — each chant_line fetched from /api/shloka-tts one by one
 *   2. Sarvam AI (voice: roopa, pace: 0.75) returns devotional base64 WAV audio
 *   3. Each line lights up with a golden glow while it's being spoken
 *   4. 600ms breath-pause between lines, then next line auto-plays
 *   5. Full pause / resume support — pausing mid-word or mid-line
 *
 * State machine:  idle → loading → playing ⇄ paused → finished → idle
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence }                   from 'framer-motion'
import { useShlokas }                                from '../hooks/useData'

// ─── Async helpers ────────────────────────────────────────────────────────────

/** Fetch one chant line from the Sarvam TTS backend (with disk cache). */
async function fetchLineAudio(shlokaId, lineIndex, lineText) {
  const res = await fetch('/api/shloka-tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: lineText, shloka_id: shlokaId, line_index: lineIndex }),
  })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(error ?? `HTTP ${res.status}`)
  }
  const { audio } = await res.json()
  return audio  // base64 WAV string
}

/** Play a base64 WAV, returning a Promise that resolves on natural end. */
function playBase64(base64, audioRef, abortSignalRef) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/wav;base64,${base64}`)
    audioRef.current = audio

    const cleanup = () => {
      audio.removeEventListener('ended',  onEnd)
      audio.removeEventListener('error',  onErr)
    }
    const onEnd = () => { cleanup(); resolve() }
    const onErr = () => { cleanup(); reject(new Error('audio error')) }

    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onErr)

    // Register an escape hatch: calling abortSignalRef.current() unblocks this
    // promise immediately (used when the user stops or switches shloka).
    abortSignalRef.current = () => { cleanup(); audio.pause(); resolve() }

    audio.play().catch(() => { cleanup(); resolve() })
  })
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

// ─────────────────────────────────────────────────────────────────────────────

export default function ShlokasPage() {
  const { shlokas, loading } = useShlokas()

  // ── Navigation / display state ────────────────────────────────────────────
  const [idx,        setIdx]        = useState(0)
  const [showRoman,  setShowRoman]  = useState(false)
  const [showTelugu, setShowTelugu] = useState(false)

  // ── Chant state machine ───────────────────────────────────────────────────
  // idle | loading | playing | paused | finished
  const [chantState,  setChantState]  = useState('idle')
  const [activeLine,  setActiveLine]  = useState(-1)   // index in chant_lines
  const [ttsError,    setTtsError]    = useState(null)  // error string or null

  // ── Refs (survive async loops without stale-closure issues) ──────────────
  const chantStateRef  = useRef('idle')    // mirrors chantState for async access
  const abortRef       = useRef(false)     // true → stop the loop at next check
  const currentAudioRef = useRef(null)     // the currently playing Audio element
  const abortSignalRef  = useRef(null)     // fn: unblocks the current playBase64()
  const pausePromiseRef = useRef(null)     // Promise that resolves when resumed
  const pauseResolveRef = useRef(null)     // resolve fn for the pause promise
  const chipStripRef    = useRef(null)

  const current = shlokas[idx]

  // ── Internal helpers ──────────────────────────────────────────────────────

  /** Block execution until the user resumes (if paused). */
  const waitIfPaused = async () => {
    if (pausePromiseRef.current) await pausePromiseRef.current
  }

  /** Hard-stop the chant: abort loop, pause audio, release all barriers. */
  const stopChant = useCallback(() => {
    abortRef.current = true
    abortSignalRef.current?.()          // unblock any in-flight playBase64()
    abortSignalRef.current = null
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }
    pauseResolveRef.current?.()         // unblock any waitIfPaused()
    pausePromiseRef.current = null
    pauseResolveRef.current = null
    chantStateRef.current = 'idle'
    setChantState('idle')
    setActiveLine(-1)
    setTtsError(null)
  }, [])

  // ── Stop when user switches shloka ────────────────────────────────────────
  useEffect(() => {
    stopChant()
    setShowRoman(false)
    setShowTelugu(false)
  }, [idx])  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => { return () => stopChant() }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-scroll chip into view ────────────────────────────────────────────
  useEffect(() => {
    const strip = chipStripRef.current
    if (!strip) return
    const chip = strip.querySelector('[data-selected="true"]')
    if (chip) chip.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [idx])

  // ── Keyboard navigation ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, shlokas.length - 1))
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shlokas.length])

  // ── Main chant loop ───────────────────────────────────────────────────────
  const playChant = useCallback(async (shloka) => {
    abortRef.current = false
    setTtsError(null)
    const lines = shloka.chant_lines

    for (let i = 0; i < lines.length; i++) {
      if (abortRef.current) break

      // 1. Mark which line we're loading
      setActiveLine(i)
      setChantState('loading')
      chantStateRef.current = 'loading'

      // 2. Fetch audio from Sarvam (or cache)
      let base64
      try {
        base64 = await fetchLineAudio(shloka.id, i, lines[i])
      } catch (err) {
        console.error('[chant] fetch error:', err)
        setTtsError(err.message)
        setChantState('idle')
        chantStateRef.current = 'idle'
        setActiveLine(-1)
        return
      }

      if (abortRef.current) break

      // 3. If the user paused while we were fetching, wait here
      await waitIfPaused()
      if (abortRef.current) break

      // 4. Play this line
      setChantState('playing')
      chantStateRef.current = 'playing'

      try {
        await playBase64(base64, currentAudioRef, abortSignalRef)
      } catch {
        // Audio error — just skip to next line
      }
      abortSignalRef.current = null

      if (abortRef.current) break

      // 5. Breath pause between lines (skip after last line)
      if (i < lines.length - 1) {
        await sleep(600)
        await waitIfPaused()
        if (abortRef.current) break
      }
    }

    // 6. Finished naturally
    if (!abortRef.current) {
      setChantState('finished')
      chantStateRef.current = 'finished'
      setActiveLine(-1)
      currentAudioRef.current = null
    }
  }, [])

  // ── User-facing controls ──────────────────────────────────────────────────

  const handlePlay = () => {
    if (!current) return
    playChant(current)
  }

  const handlePause = () => {
    // Pause the live audio element
    if (currentAudioRef.current) currentAudioRef.current.pause()
    // Create a pause barrier — the async loop will wait at the next waitIfPaused()
    pausePromiseRef.current = new Promise(resolve => { pauseResolveRef.current = resolve })
    chantStateRef.current = 'paused'
    setChantState('paused')
  }

  const handleResume = () => {
    // Resume audio if we were mid-line
    if (currentAudioRef.current) currentAudioRef.current.play().catch(() => {})
    // Release the pause barrier
    pauseResolveRef.current?.()
    pausePromiseRef.current = null
    pauseResolveRef.current = null
    chantStateRef.current = 'playing'
    setChantState('playing')
  }

  const handleToggle = () => {
    if (chantState === 'idle' || chantState === 'finished') handlePlay()
    else if (chantState === 'playing' || chantState === 'loading') handlePause()
    else if (chantState === 'paused') handleResume()
  }

  // ── Button label / icon based on state ────────────────────────────────────
  const btnConfig = (() => {
    if (chantState === 'loading')  return { icon: '⟳', label: 'Loading…',    spin: true,  disabled: false }
    if (chantState === 'playing')  return { icon: '⏸', label: 'Pause',        spin: false, disabled: false }
    if (chantState === 'paused')   return { icon: '▶', label: 'Resume',       spin: false, disabled: false }
    if (chantState === 'finished') return { icon: '↺', label: 'Play Again',   spin: false, disabled: false }
    return                                { icon: '▶', label: 'Play Shloka',  spin: false, disabled: false }
  })()

  // ─────────────────────────────────────────────────────────────────────────
  if (loading || !current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(160deg, #FFF7ED 0%, #FFFBF0 100%)' }}>
        <div className="text-5xl animate-bounce">🕉️</div>
        <p className="font-extrabold text-lg text-orange-500">Loading Shlokas…</p>
      </div>
    )
  }

  const isActive = (i) => i === activeLine
  const isIdle   = chantState === 'idle' || chantState === 'finished'

  return (
    <div
      className="min-h-screen pb-12 transition-all duration-500"
      style={{ background: `linear-gradient(160deg, ${current.light} 0%, #ffffff 55%, ${current.light} 100%)` }}
    >
      {/* Dot grid backdrop */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${current.glow}33 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-xl mx-auto px-4 flex flex-col gap-4">

        {/* ── Page header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-xl font-black" style={{ color: current.color }}>🕉️ Shlokas &amp; Padyalu</h1>
            <p className="text-xs font-semibold text-slate-400">Sacred verses for daily recitation</p>
          </div>
          <span
            className="text-xs font-extrabold px-3 py-1.5 rounded-full"
            style={{ color: current.color, background: `${current.color}15` }}
          >
            {idx + 1} / {shlokas.length}
          </span>
        </div>

        {/* ── Chip strip ───────────────────────────────────────────── */}
        <div
          ref={chipStripRef}
          className="flex gap-2 overflow-x-auto py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {shlokas.map((s, i) => {
            const selected = i === idx
            return (
              <motion.button
                key={s.id}
                data-selected={selected ? 'true' : 'false'}
                onClick={() => setIdx(i)}
                whileTap={{ scale: 0.9 }}
                className="shrink-0 flex flex-col items-center gap-0.5 rounded-2xl transition-all"
                style={
                  selected
                    ? { background: s.color, color: 'white', padding: '8px 12px', boxShadow: `0 6px 18px ${s.glow}88`, minWidth: 64 }
                    : { background: 'white', color: '#94A3B8', border: '2px solid #E8ECF0', padding: '6px 10px', minWidth: 56 }
                }
              >
                <span className="text-lg leading-none">{s.emoji}</span>
                <span className="text-[9px] font-extrabold leading-none mt-0.5 max-w-[52px] truncate">
                  {s.name.split(' ')[0]}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* ── Shloka card ──────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-3"
          >
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 12px 48px ${current.glow}44, 0 3px 12px #00000008` }}
            >
              {/* Color stripe */}
              <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${current.glow}, ${current.color})` }} />

              {/* Header row */}
              <div
                className="flex items-center gap-3 px-5 pt-4 pb-3"
                style={{ background: `linear-gradient(135deg, ${current.color}12 0%, ${current.light} 100%)` }}
              >
                <motion.span
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl leading-none"
                >
                  {current.emoji}
                </motion.span>
                <div className="flex-1">
                  <h2 className="baloo text-xl font-black leading-none" style={{ color: current.color }}>
                    {current.name}
                  </h2>
                </div>
              </div>

              {/* ── Karaoke chant lines ──────────────────────────────── */}
              <div className="px-5 pt-4 pb-2 flex flex-col items-center gap-2">
                {current.chant_lines.map((line, i) => {
                  const active = isActive(i)
                  return (
                    <motion.div
                      key={i}
                      className="w-full text-center rounded-2xl transition-all duration-300"
                      style={{
                        padding: active ? '8px 12px' : '4px 8px',
                        opacity: isIdle ? 1 : (active ? 1 : 0.38),
                        background: active
                          ? `linear-gradient(135deg, rgba(255,200,50,0.18), rgba(255,170,20,0.12))`
                          : 'transparent',
                        boxShadow: active
                          ? `0 0 24px rgba(255,200,50,0.28), inset 0 0 12px rgba(255,200,50,0.1)`
                          : 'none',
                        border: active
                          ? '1.5px solid rgba(255,200,50,0.35)'
                          : '1.5px solid transparent',
                      }}
                    >
                      <p
                        className="telugu font-extrabold leading-relaxed"
                        style={{
                          color: active ? current.color : `${current.color}CC`,
                          fontSize: '1.4rem',
                          lineHeight: 1.9,
                          textShadow: active ? `0 2px 16px ${current.glow}77` : 'none',
                        }}
                      >
                        {line}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* ── Play controls ────────────────────────────────────── */}
              <div className="flex flex-col items-center gap-3 px-5 py-4">

                {/* Status / progress label */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {chantState === 'playing' && (
                      <motion.div
                        key="playing"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      >
                        {[0.4, 1, 0.6, 0.9, 0.5].map((h, i) => (
                          <motion.div
                            key={i}
                            className="w-1 rounded-full"
                            style={{ background: current.color, height: 16 }}
                            animate={{ scaleY: [h, 1, h * 0.4, 1, h] }}
                            transition={{ duration: 0.75, repeat: Infinity, delay: i * 0.11, ease: 'easeInOut' }}
                          />
                        ))}
                        <span className="text-xs font-extrabold ml-1" style={{ color: current.color }}>
                          {activeLine >= 0
                            ? `Line ${activeLine + 1} of ${current.chant_lines.length}`
                            : 'Chanting…'}
                        </span>
                      </motion.div>
                    )}

                    {chantState === 'loading' && (
                      <motion.div
                        key="loading"
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      >
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="text-base"
                          style={{ color: current.color }}
                        >
                          ⟳
                        </motion.span>
                        <span className="text-xs font-extrabold" style={{ color: `${current.color}99` }}>
                          Fetching verse…
                        </span>
                      </motion.div>
                    )}

                    {chantState === 'paused' && (
                      <motion.div
                        key="paused"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      >
                        <span className="text-xs font-extrabold" style={{ color: current.color }}>
                          ⏸ Paused · tap to continue
                        </span>
                      </motion.div>
                    )}

                    {chantState === 'finished' && (
                      <motion.div
                        key="finished"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      >
                        <span className="text-xs font-extrabold" style={{ color: current.color }}>
                          ✨ Om Shanti 🙏
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* TTS error banner */}
                {ttsError && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="w-full px-4 py-2 rounded-xl text-xs font-semibold text-center"
                    style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                  >
                    ⚠️ {ttsError.includes('SARVAM_API_KEY')
                      ? 'Add your SARVAM_API_KEY to the .env file to enable chanting.'
                      : `TTS error: ${ttsError}`}
                  </motion.div>
                )}

                {/* Main toggle button */}
                <motion.button
                  onClick={handleToggle}
                  disabled={btnConfig.disabled}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center gap-3 px-8 py-3.5 rounded-full font-extrabold text-white text-base disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${current.glow}, ${current.color})`,
                    boxShadow: `0 6px 24px ${current.glow}88`,
                  }}
                >
                  <motion.span
                    animate={btnConfig.spin ? { rotate: 360 } : { rotate: 0 }}
                    transition={btnConfig.spin ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                    className="text-base leading-none"
                  >
                    {btnConfig.icon}
                  </motion.span>
                  {btnConfig.label}
                </motion.button>
              </div>

              {/* ── Telugu Pronunciation collapsible ── */}
              <div className="border-t border-slate-50">
                <button
                  onClick={() => setShowTelugu(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-extrabold transition-all"
                  style={{ color: showTelugu ? current.color : '#94A3B8' }}
                >
                  <span>🕉️ తెలుగు చదవడం (Telugu Reading)</span>
                  <span className="text-xs">{showTelugu ? '▲ Hide' : '▼ Show'}</span>
                </button>
                <AnimatePresence>
                  {showTelugu && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="telugu px-5 pb-4 font-semibold leading-loose text-center"
                        style={{
                          whiteSpace: 'pre-line',
                          color: current.color,
                          fontSize: '1.05rem',
                          background: `${current.color}06`,
                        }}
                      >
                        {current.telugu_plain ?? current.telugu}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── English Pronunciation collapsible ── */}
              <div className="border-t border-slate-50">
                <button
                  onClick={() => setShowRoman(v => !v)}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-extrabold transition-all"
                  style={{ color: showRoman ? current.color : '#94A3B8' }}
                >
                  <span>🔤 English Pronunciation</span>
                  <span className="text-xs">{showRoman ? '▲ Hide' : '▼ Show'}</span>
                </button>
                <AnimatePresence>
                  {showRoman && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="px-5 pb-4 text-sm font-semibold text-slate-500 leading-relaxed"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {current.roman}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Meaning ── */}
              <div
                className="mx-4 mb-4 px-4 py-3 rounded-2xl"
                style={{ background: `${current.color}10`, border: `1.5px solid ${current.color}20` }}
              >
                <p className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: current.color }}>
                  💡 Meaning
                </p>
                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                  {current.meaning}
                </p>
              </div>
            </div>

            {/* ── Prev / Next ── */}
            <div className="flex items-center justify-between px-1">
              <motion.button
                onClick={() => setIdx(i => Math.max(i - 1, 0))}
                disabled={idx === 0}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all"
                style={
                  idx === 0
                    ? { color: '#CBD5E1', background: '#F1F5F9', border: '2px solid #E2E8F0' }
                    : { color: current.color, background: current.light, border: `2px solid ${current.color}35` }
                }
              >
                ← Prev
              </motion.button>

              <span className="text-sm font-extrabold" style={{ color: `${current.color}88` }}>
                {idx + 1} <span style={{ color: '#CBD5E1' }}>/</span> {shlokas.length}
              </span>

              <motion.button
                onClick={() => setIdx(i => Math.min(i + 1, shlokas.length - 1))}
                disabled={idx === shlokas.length - 1}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all"
                style={
                  idx === shlokas.length - 1
                    ? { color: '#CBD5E1', background: '#F1F5F9', border: '2px solid #E2E8F0' }
                    : { color: current.color, background: current.light, border: `2px solid ${current.color}35` }
                }
              >
                Next →
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs pb-4 font-semibold" style={{ color: `${current.color}55` }}>
          Telugu Trace Kids · Om Namah 🕉️
        </p>
      </div>
    </div>
  )
}
