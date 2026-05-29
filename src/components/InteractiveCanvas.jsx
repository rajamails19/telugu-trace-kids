/**
 * InteractiveCanvas — encouraging tracing
 *
 * Two offscreen canvases:
 *   maskCanvas  — letter shape filled solid white (used as a clip)
 *   fillCanvas  — accumulates the user's colored fill
 *
 * Every stroke is drawn wide onto fillCanvas, then immediately clipped with
 * destination-in against maskCanvas.  Result: whatever the user draws near
 * the letters, the letters fill in perfectly — messy input → beautiful output.
 */
import { useRef, useEffect, useCallback, useState } from 'react'
import { useSpeech, speakWord } from '../hooks/useSpeech'

const SVG_W  = 720
const SVG_H  = 480          // slightly taller to give single letters room
const SVG_TX = SVG_W / 2

// Font size & baseline differ between word (multi-char) and single-letter modes
const WORD_FS   = 260       // fits multi-character words nicely
const LETTER_FS = 450       // huge — fills the canvas for single-letter practice

const WORD_TY   = SVG_H * 0.74   // ≈ 355  (words sit a bit high)
const LETTER_TY = SVG_H * 0.76   // ≈ 365  (single letter — keep baseline central)

// Brush width: in letter mode use a bigger brush to match the larger strokes
const BRUSH_WORD   = 72
const BRUSH_LETTER = 90

export default function InteractiveCanvas({ word, letterMode = false }) {
  const SVG_FS    = letterMode ? LETTER_FS   : WORD_FS
  const SVG_TY    = letterMode ? LETTER_TY   : WORD_TY
  const BRUSH_SVG = letterMode ? BRUSH_LETTER : BRUSH_WORD
  const mainRef = useRef(null)
  const fillRef = useRef(null)
  const maskRef = useRef(null)
  const drawing      = useRef(false)
  const lastPt       = useRef(null)
  const speakTimer   = useRef(null)          // fires after drawing pauses
  const [hasDrawn, setHasDrawn] = useState(false)
  const { muted, toggleMute, speak } = useSpeech()

  /* ── coordinate helper ─────────────────────────────────── */
  const getPt = (e) => {
    const rect = mainRef.current.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const src  = e.touches ? e.touches[0] : e
    return {
      x: (src.clientX - rect.left) * dpr,
      y: (src.clientY - rect.top)  * dpr,
    }
  }

  /* ── draw the dotted guide (physical-pixel space) ──────── */
  const drawGuide = useCallback((ctx, phW, phH) => {
    const sc = Math.min(phW / SVG_W, phH / SVG_H)
    const fs = SVG_FS * sc
    const tx = SVG_TX * (phW / SVG_W)
    const ty = SVG_TY * (phH / SVG_H)

    ctx.textAlign    = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font         = `700 ${fs}px 'Noto Sans Telugu', sans-serif`

    // Soft glow fill
    ctx.fillStyle = `${word.glow}44`
    ctx.fillText(word.telugu, tx, ty)

    // Dashed outline — slightly thicker in letter mode so dashes are visible on big strokes
    const dashOn  = letterMode ? Math.round(14 * sc) : Math.round(11 * sc)
    const dashOff = letterMode ? Math.round(10 * sc) : Math.round(8  * sc)
    ctx.setLineDash([dashOn, dashOff])
    ctx.lineWidth   = (letterMode ? 4.5 : 3.5) * sc
    ctx.strokeStyle = word.color
    ctx.lineCap     = 'round'
    ctx.strokeText(word.telugu, tx, ty)
    ctx.setLineDash([])
  }, [word, letterMode, SVG_FS, SVG_TY])

  /* ── composite fill → display ──────────────────────────── */
  const redraw = useCallback(() => {
    const canvas     = mainRef.current
    const fillCanvas = fillRef.current
    if (!canvas || !fillCanvas) return

    const ctx = canvas.getContext('2d')
    const phW = canvas.width
    const phH = canvas.height

    ctx.clearRect(0, 0, phW, phH)

    // 1. Dotted guide behind
    drawGuide(ctx, phW, phH)

    // 2. Colored fill on top (slightly transparent so dotted edge still peeks)
    ctx.globalAlpha = 0.92
    ctx.drawImage(fillCanvas, 0, 0)
    ctx.globalAlpha = 1

    // 3. Re-draw dashed outline faintly on top so kids still see the guide
    const sc = Math.min(phW / SVG_W, phH / SVG_H)
    const fs = SVG_FS * sc
    const tx = SVG_TX * (phW / SVG_W)
    const ty = SVG_TY * (phH / SVG_H)
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.font         = `700 ${fs}px 'Noto Sans Telugu', sans-serif`
    const dashOn  = letterMode ? Math.round(14 * sc) : Math.round(11 * sc)
    const dashOff = letterMode ? Math.round(10 * sc) : Math.round(8  * sc)
    ctx.setLineDash([dashOn, dashOff])
    ctx.lineWidth   = (letterMode ? 4 : 3) * sc
    ctx.strokeStyle = 'rgba(255,255,255,0.55)'
    ctx.lineCap     = 'round'
    ctx.strokeText(word.telugu, tx, ty)
    ctx.setLineDash([])
  }, [drawGuide, word, letterMode, SVG_FS, SVG_TY])

  /* ── initialise all canvases ───────────────────────────── */
  const init = useCallback(async () => {
    const canvas = mainRef.current
    if (!canvas) return
    await document.fonts.ready

    const rect = canvas.getBoundingClientRect()
    const dpr  = window.devicePixelRatio || 1
    const phW  = Math.round(rect.width  * dpr)
    const phH  = Math.round(rect.height * dpr)

    canvas.width  = phW
    canvas.height = phH

    // Letter mask: white filled letter (used for destination-in clip)
    const mask = document.createElement('canvas')
    mask.width  = phW
    mask.height = phH
    const mc   = mask.getContext('2d')
    const sc   = Math.min(phW / SVG_W, phH / SVG_H)
    mc.textAlign    = 'center'
    mc.textBaseline = 'alphabetic'
    mc.font         = `700 ${SVG_FS * sc}px 'Noto Sans Telugu', sans-serif`
    mc.fillStyle    = 'white'
    mc.fillText(word.telugu, SVG_TX * (phW / SVG_W), SVG_TY * (phH / SVG_H))  // SVG_FS/TY from component scope
    maskRef.current = mask

    // Fill canvas: starts empty
    const fill    = document.createElement('canvas')
    fill.width    = phW
    fill.height   = phH
    fillRef.current = fill

    // Draw initial guide
    const ctx = canvas.getContext('2d')
    drawGuide(ctx, phW, phH)
  }, [word.id, drawGuide])

  useEffect(() => {
    init()
    const ro = new ResizeObserver(init)
    if (mainRef.current) ro.observe(mainRef.current)
    return () => {
      ro.disconnect()
      clearTimeout(speakTimer.current)
    }
  }, [word.id, init])

  /* ── pointer handlers ──────────────────────────────────── */
  const onStart = useCallback((e) => {
    e.preventDefault()
    drawing.current = true
    lastPt.current  = getPt(e)
    setHasDrawn(true)
    // Cancel any pending auto-speak so it doesn't fire mid-stroke
    clearTimeout(speakTimer.current)
  }, [])

  const onMove = useCallback((e) => {
    e.preventDefault()
    if (!drawing.current || !lastPt.current) return

    const fillCanvas = fillRef.current
    const maskCanvas = maskRef.current
    if (!fillCanvas || !maskCanvas) return

    const fCtx = fillCanvas.getContext('2d')
    const pt   = getPt(e)
    const last = lastPt.current
    const sc   = Math.min(fillCanvas.width / SVG_W, fillCanvas.height / SVG_H)
    const mid  = { x: (last.x + pt.x) / 2, y: (last.y + pt.y) / 2 }

    // Draw a wide, round stroke (BRUSH_SVG units → physical pixels)
    fCtx.beginPath()
    fCtx.moveTo(last.x, last.y)
    fCtx.quadraticCurveTo(last.x, last.y, mid.x, mid.y)
    fCtx.lineWidth   = BRUSH_SVG * sc
    fCtx.lineCap     = 'round'
    fCtx.lineJoin    = 'round'
    fCtx.strokeStyle = word.color
    fCtx.stroke()

    // Clip the entire fill canvas to the letter mask
    fCtx.globalCompositeOperation = 'destination-in'
    fCtx.drawImage(maskCanvas, 0, 0)
    fCtx.globalCompositeOperation = 'source-over'

    lastPt.current = pt
    redraw()
  }, [word, redraw])

  const onEnd = useCallback(() => {
    drawing.current = false
    lastPt.current  = null
    // Speak the word 1.2 s after the user lifts their finger / mouse
    clearTimeout(speakTimer.current)
    speakTimer.current = setTimeout(() => speak(word), 1200)
  }, [speak, word])

  // Attach touch events as non-passive so preventDefault() works
  // (React makes onTouchXxx passive by default, which blocks preventDefault)
  useEffect(() => {
    const canvas = mainRef.current
    if (!canvas) return
    canvas.addEventListener('touchstart', onStart, { passive: false })
    canvas.addEventListener('touchmove',  onMove,  { passive: false })
    canvas.addEventListener('touchend',   onEnd,   { passive: false })
    return () => {
      canvas.removeEventListener('touchstart', onStart)
      canvas.removeEventListener('touchmove',  onMove)
      canvas.removeEventListener('touchend',   onEnd)
    }
  }, [onStart, onMove, onEnd])

  /* ── clear ─────────────────────────────────────────────── */
  const clear = useCallback(() => {
    clearTimeout(speakTimer.current)
    const canvas     = mainRef.current
    const fillCanvas = fillRef.current
    if (!canvas || !fillCanvas) return
    fillCanvas.getContext('2d').clearRect(0, 0, fillCanvas.width, fillCanvas.height)
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGuide(ctx, canvas.width, canvas.height)
    setHasDrawn(false)
  }, [drawGuide])

  /* ── render ─────────────────────────────────────────────── */
  return (
    <div className="relative select-none">
      <canvas
        ref={mainRef}
        className="w-full touch-none rounded-2xl"
        style={{
          display: 'block',
          cursor: 'crosshair',
          aspectRatio: `${SVG_W} / ${SVG_H}`,
          maxHeight: letterMode ? 420 : 340,
        }}
        onMouseDown={onStart}
        onMouseMove={onMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      />

      {/* 🔊 / 🔇 — top right
            🔊 (sound on)  → tap to mute (no audio on mute)
            🔇 (muted)     → tap to unmute and immediately hear the word  */}
      <button
        onClick={() => {
          toggleMute()
          if (muted) speak(word)   // muted was true → now unmuting → speak
        }}
        className="absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all"
        style={{
          background: muted ? '#F1F5F9'    : word.light,
          color:      muted ? '#94A3B8'    : word.color,
          border:     `2px solid ${muted ? '#E2E8F0' : word.color + '40'}`,
          boxShadow:  muted ? 'none'       : `0 2px 8px ${word.glow}55`,
        }}
        title={muted ? 'Tap to unmute' : 'Tap to mute'}
      >
        {muted ? (
          // Muted icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          // Sound-on icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>

      {/* ▶ Play — top left: always speaks regardless of mute toggle */}
      <button
        onClick={() => speakWord(word.telugu)}
        className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90"
        style={{
          background: word.light,
          color:      word.color,
          border:     `2px solid ${word.color}40`,
          boxShadow:  `0 2px 8px ${word.glow}55`,
        }}
        title="Tap to hear the word"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>

      {/* ↺ Clear — bottom left */}
      {hasDrawn && (
        <button
          onClick={clear}
          className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-full"
          style={{
            background: word.light,
            color: word.color,
            border: `2px solid ${word.color}40`,
            boxShadow: `0 2px 8px ${word.glow}55`,
          }}
        >
          ↺ Clear
        </button>
      )}
    </div>
  )
}
