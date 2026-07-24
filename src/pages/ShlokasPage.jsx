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
 * Visual: Telugu Vani premium design — deity tabs, featured verse card, accordions.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence }                   from 'framer-motion'
import { useShlokas }                                from '../hooks/useData'
import {
  T, DEITY_TINT, DEITY_KEYS, DotField, Eyebrow, TVButton, TVCard,
  TVPage, TVFooter, mandalaDataURI,
} from '../components/TV'

// ─── Async helpers ────────────────────────────────────────────────────────────

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
  return audio
}

function playBase64(base64, audioRef, abortSignalRef) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/wav;base64,${base64}`)
    audioRef.current = audio
    const cleanup = () => {
      audio.removeEventListener('ended', onEnd)
      audio.removeEventListener('error', onErr)
    }
    const onEnd = () => { cleanup(); resolve() }
    const onErr = () => { cleanup(); reject(new Error('audio error')) }
    audio.addEventListener('ended', onEnd)
    audio.addEventListener('error', onErr)
    abortSignalRef.current = () => { cleanup(); audio.pause(); resolve() }
    audio.play().catch(() => { cleanup(); resolve() })
  })
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ─── Accordion component ──────────────────────────────────────────────────────
function Accordion({ title, te, children, open, onToggle }) {
  return (
    <div style={{ borderTop: `1px solid ${T.border}` }}>
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'none', border: 'none', cursor: 'pointer', padding: '20px 4px', textAlign: 'left',
      }}>
        <span style={{ fontFamily: te ? T.te : T.serif, fontWeight: 700, fontSize: 18, color: T.ink }}>
          {te
            ? <><span style={{ fontFamily: T.te }}>{te}</span> <span style={{ fontFamily: T.serif, color: T.inkSoft, fontSize: 16 }}>· {title}</span></>
            : title
          }
        </span>
        <span style={{
          width: 32, height: 32, borderRadius: '50%', background: T.peach, color: T.orange,
          display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s', flexShrink: 0,
        }}>▼</span>
      </button>
      <div style={{
        maxHeight: open ? 320 : 0, overflow: 'hidden',
        transition: 'max-height .35s ease, opacity .3s', opacity: open ? 1 : 0,
      }}>
        <div style={{ padding: '0 4px 22px' }}>{children}</div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ShlokasPage() {
  const { shlokas, loading } = useShlokas()

  // ── Navigation / display state ────────────────────────────────────────────
  const [idx,         setIdx]         = useState(0)
  const [openAccordion, setOpenAccordion] = useState('meaning')

  // ── Chant state machine ───────────────────────────────────────────────────
  const [chantState,  setChantState]  = useState('idle')
  const [activeLine,  setActiveLine]  = useState(-1)
  const [ttsError,    setTtsError]    = useState(null)

  // ── Refs ──────────────────────────────────────────────────────────────────
  const chantStateRef   = useRef('idle')
  const abortRef        = useRef(false)
  const currentAudioRef = useRef(null)
  const abortSignalRef  = useRef(null)
  const pausePromiseRef = useRef(null)
  const pauseResolveRef = useRef(null)

  const current = shlokas[idx]

  const waitIfPaused = async () => {
    if (pausePromiseRef.current) await pausePromiseRef.current
  }

  const stopChant = useCallback(() => {
    abortRef.current = true
    abortSignalRef.current?.()
    abortSignalRef.current = null
    if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null }
    pauseResolveRef.current?.()
    pausePromiseRef.current = null
    pauseResolveRef.current = null
    chantStateRef.current = 'idle'
    setChantState('idle')
    setActiveLine(-1)
    setTtsError(null)
  }, [])

  useEffect(() => {
    stopChant()
    setOpenAccordion('meaning')
  }, [idx])

  useEffect(() => { return () => stopChant() }, [])

  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, shlokas.length - 1))
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [shlokas.length])

  const playChant = useCallback(async shloka => {
    abortRef.current = false
    setTtsError(null)
    const lines = shloka.chant_lines

    for (let i = 0; i < lines.length; i++) {
      if (abortRef.current) break
      setActiveLine(i)
      setChantState('loading')
      chantStateRef.current = 'loading'

      let base64
      try {
        base64 = await fetchLineAudio(shloka.id, i, lines[i])
      } catch (err) {
        setTtsError(err.message)
        setChantState('idle'); chantStateRef.current = 'idle'
        setActiveLine(-1); return
      }

      if (abortRef.current) break
      await waitIfPaused()
      if (abortRef.current) break

      setChantState('playing'); chantStateRef.current = 'playing'
      try { await playBase64(base64, currentAudioRef, abortSignalRef) } catch { /* skip */ }
      abortSignalRef.current = null

      if (abortRef.current) break
      if (i < lines.length - 1) { await sleep(600); await waitIfPaused(); if (abortRef.current) break }
    }

    if (!abortRef.current) {
      setChantState('finished'); chantStateRef.current = 'finished'
      setActiveLine(-1); currentAudioRef.current = null
    }
  }, [])

  const handlePlay   = () => { if (!current) return; playChant(current) }
  const handlePause  = () => {
    if (currentAudioRef.current) currentAudioRef.current.pause()
    pausePromiseRef.current = new Promise(resolve => { pauseResolveRef.current = resolve })
    chantStateRef.current = 'paused'; setChantState('paused')
  }
  const handleResume = () => {
    if (currentAudioRef.current) currentAudioRef.current.play().catch(() => {})
    pauseResolveRef.current?.()
    pausePromiseRef.current = null; pauseResolveRef.current = null
    chantStateRef.current = 'playing'; setChantState('playing')
  }
  const handleToggle = () => {
    if (chantState === 'idle' || chantState === 'finished') handlePlay()
    else if (chantState === 'playing' || chantState === 'loading') handlePause()
    else if (chantState === 'paused') handleResume()
  }

  const playIcon = chantState === 'playing' ? '⏸' : chantState === 'paused' ? '▶' : chantState === 'finished' ? '↺' : '▶'
  const isIdle = chantState === 'idle' || chantState === 'finished'

  // ── Deity panel data ──────────────────────────────────────────────────────
  const deityKey  = current ? (DEITY_KEYS[current.id - 1] ?? 'ganesha') : 'ganesha'
  const panelTint = DEITY_TINT[deityKey] ?? '#241A55'

  if (loading || !current) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#FBF4E4' }}>
        <div style={{ fontSize: 48 }}>🕉️</div>
        <p style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink }}>Loading Shlokas…</p>
      </div>
    )
  }

  const romanLines = (current.roman ?? '').split('\n').filter(r => r.trim())

  return (
    <div style={{ minHeight: '100svh', position: 'relative' }}>
      <DotField />
      <TVPage>

        {/* ── Page header ──────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '34px 0 26px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Daily recitation</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>
            Nitya Shlokas
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: '0 0 18px' }}>
            Sacred verses with correct pronunciation and gentle meaning — for tiny voices.
          </p>
          <span style={{ display: 'inline-block', background: T.white, border: `1px solid ${T.border}`, borderRadius: 999, padding: '7px 18px', fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: T.ink }}>
            {idx + 1} / {shlokas.length}
          </span>
        </div>

        {/* ── Deity tab pills ──────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 2px 18px', justifyContent: 'center', flexWrap: 'wrap', animation: 'tvRise .5s .05s both', scrollbarWidth: 'none' }}>
          {shlokas.map((s, di) => {
            const active = di === idx
            return (
              <button
                key={s.id}
                onClick={() => setIdx(di)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  whiteSpace: 'nowrap', cursor: 'pointer',
                  border: active ? 'none' : `1px solid ${T.border}`,
                  borderRadius: 999, padding: '11px 18px',
                  background: active ? T.orange : T.white,
                  color: active ? '#fff' : T.ink,
                  fontFamily: T.sans, fontWeight: 800, fontSize: 14,
                  boxShadow: active ? '0 12px 22px -10px rgba(240,86,14,0.6)' : 'none',
                  transition: 'all .2s',
                }}
              >
                <span>{s.emoji}</span>
                {s.name.split(' ')[0]}
              </button>
            )
          })}
        </div>

        {/* ── Featured verse card ──────────────────────────────── */}
        <TVCard style={{ padding: 'clamp(24px,3vw,40px)', overflow: 'hidden', animation: 'tvRise .5s .12s both' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="tv-shloka-grid">

                {/* Left: verse + play control */}
                <div>
                  {/* "Featured verse" eyebrow pill */}
                  <div style={{ display: 'inline-block', background: 'rgba(245,182,43,0.16)', borderRadius: 999, padding: '7px 15px', marginBottom: 22 }}>
                    <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 11.5, letterSpacing: 1.8, textTransform: 'uppercase', color: T.orange }}>
                      Featured verse · {current.name}
                    </span>
                  </div>

                  {/* Chant lines with karaoke glow */}
                  {current.chant_lines.map((line, i) => {
                    const active = i === activeLine
                    return (
                      <div
                        key={i}
                        style={{
                          fontFamily: T.teSerif, fontWeight: 600,
                          fontSize: 'clamp(20px,2.5vw,30px)', color: T.ink,
                          lineHeight: 1.75,
                          padding: active ? '6px 10px' : '2px 10px',
                          borderRadius: 10,
                          background: active ? 'rgba(255,200,50,0.18)' : 'transparent',
                          boxShadow: active ? '0 0 24px rgba(255,200,50,0.28), inset 0 0 12px rgba(255,200,50,0.1)' : 'none',
                          border: `1.5px solid ${active ? 'rgba(255,200,50,0.35)' : 'transparent'}`,
                          opacity: isIdle ? 1 : (active ? 1 : 0.4),
                          transition: 'opacity .3s, background .3s, box-shadow .3s',
                          marginBottom: 4,
                        }}
                      >
                        {line}
                      </div>
                    )
                  })}

                  {/* Play / pause / resume button row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28 }}>
                    <button
                      onClick={handleToggle}
                      style={{
                        width: 56, height: 56, borderRadius: '50%', background: T.ink,
                        color: '#fff', border: 'none', cursor: 'pointer', fontSize: 20,
                        boxShadow: '0 14px 26px -12px rgba(58,30,156,0.7)',
                        display: 'grid', placeItems: 'center',
                        transition: 'transform .18s',
                        animation: chantState === 'loading' ? 'tvSpin 1s linear infinite' : 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                    >
                      {chantState === 'loading' ? '⟳' : playIcon}
                    </button>
                    <div>
                      <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 18, color: T.ink, whiteSpace: 'nowrap' }}>
                        {chantState === 'playing'  ? `Line ${activeLine + 1} of ${current.chant_lines.length}` :
                         chantState === 'loading'  ? 'Fetching verse…' :
                         chantState === 'paused'   ? 'Paused' :
                         chantState === 'finished' ? 'Om Shanti 🙏' :
                         'Listen & Repeat'}
                      </div>
                      <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 13, color: T.inkSoft, whiteSpace: 'nowrap' }}>
                        Slow tempo · Sarvam AI · guided chant
                      </div>
                    </div>
                  </div>

                  {/* TTS error */}
                  {ttsError && (
                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 12, background: '#FEF2F2', color: '#DC2626', fontFamily: T.sans, fontWeight: 600, fontSize: 13, border: '1px solid #FCA5A5' }}>
                      ⚠️ {ttsError.includes('SARVAM_API_KEY')
                        ? 'Add SARVAM_API_KEY to .env to enable chanting.'
                        : `TTS: ${ttsError}`}
                    </div>
                  )}
                </div>

                {/* Right: deity panel */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    position: 'relative', width: 'min(320px, 72vw)', aspectRatio: '1',
                    borderRadius: 30, overflow: 'hidden',
                    background: `radial-gradient(120% 120% at 50% 30%, ${panelTint}, #16102E)`,
                    boxShadow: '0 34px 56px -28px rgba(36,26,85,0.7), 0 0 0 1px rgba(245,182,43,0.25) inset',
                    padding: 8,
                  }}>
                    <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(246,194,90,0.32), transparent 60%)', animation: 'tvGlow 5s ease-in-out infinite' }} />
                    <img
                      src={mandalaDataURI()}
                      alt={current.name}
                      style={{ position: 'relative', width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: 22 }}
                    />
                  </div>
                </div>
              </div>

              {/* ── Accordions ─────────────────────────────────────── */}
              <div style={{ marginTop: 34 }}>
                <Accordion
                  title="Telugu Reading" te="తెలుగు చదవడం"
                  open={openAccordion === 'te'}
                  onToggle={() => setOpenAccordion(openAccordion === 'te' ? '' : 'te')}
                >
                  <p style={{ fontFamily: T.teSerif, fontWeight: 400, fontSize: 19, color: T.inkSoft, lineHeight: 1.9, margin: 0 }}>
                    {current.chant_lines.join(' · ')}
                  </p>
                </Accordion>

                <Accordion
                  title="English Pronunciation"
                  open={openAccordion === 'en'}
                  onToggle={() => setOpenAccordion(openAccordion === 'en' ? '' : 'en')}
                >
                  {romanLines.map((r, i) => (
                    <div key={i} style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15.5, color: T.inkSoft, lineHeight: 1.7 }}>{r}</div>
                  ))}
                </Accordion>

                <Accordion
                  title="💡 Meaning"
                  open={openAccordion === 'meaning'}
                  onToggle={() => setOpenAccordion(openAccordion === 'meaning' ? '' : 'meaning')}
                >
                  <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 16, color: T.inkSoft, lineHeight: 1.7, margin: 0 }}>
                    {current.meaning}
                  </p>
                </Accordion>
              </div>
            </motion.div>
          </AnimatePresence>
        </TVCard>

        {/* ── Prev / Next ──────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '26px 0 4px', animation: 'tvRise .5s .18s both' }}>
          <TVButton variant="ghost" onClick={() => setIdx(i => Math.max(i - 1, 0))}>← Prev</TVButton>
          <TVButton onClick={() => setIdx(i => Math.min(i + 1, shlokas.length - 1))}>Next Shloka →</TVButton>
        </div>

      </TVPage>
      <TVFooter />
    </div>
  )
}
