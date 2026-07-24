/**
 * TracingPage.jsx — Letter + Word tracing practice
 *
 * All logic unchanged: word/letter mode toggle, chip strip, keyboard nav,
 * speak-on-change, InteractiveCanvas with mask-fill reveal.
 * Visual layer restyled to match Telugu Vani premium design.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import InteractiveCanvas from '../components/InteractiveCanvas'
import { speakWord } from '../hooks/useSpeech'
import { useWords, useLetters } from '../hooks/useData'
import { T, DotField, Eyebrow, TVButton, TVCard, TVPage, TVFooter } from '../components/TV'

const LETTER_CATS = [
  { key: 'vowels',     label: 'Vowels',     labelTe: 'అచ్చులు' },
  { key: 'consonants', label: 'Consonants', labelTe: 'హల్లులు' },
]

export default function TracingPage() {
  // ── Data ──────────────────────────────────────────────────────────────────
  const { words, loading: wordsLoading }               = useWords()
  const { vowels, consonants, loading: lettersLoading } = useLetters()

  const [mode, setMode]           = useState('letters')
  const [letterCat, setLetterCat] = useState('vowels')
  const [wordIdx, setWordIdx]     = useState(0)
  const [letterIdx, setLetterIdx] = useState(0)
  const [toast, setToast]         = useState(false)

  const chipStripRef = useRef(null)

  const letterData = letterCat === 'vowels' ? vowels : consonants
  const items      = mode === 'words' ? words : letterData
  const idx        = mode === 'words' ? wordIdx : letterIdx
  const setIdx     = useCallback(
    fn => mode === 'words' ? setWordIdx(fn) : setLetterIdx(fn),
    [mode],
  )
  const current = items[idx] ?? items[0]

  /* ── Speak on item change ─────────────────────────────── */
  useEffect(() => {
    if (!current) return
    const t = setTimeout(() => speakWord(current.telugu), 500)
    return () => clearTimeout(t)
  }, [current?.id])

  /* ── Auto-scroll chip into view ───────────────────────── */
  useEffect(() => {
    const strip = chipStripRef.current
    if (!strip) return
    const chip = strip.querySelector('[data-selected="true"]')
    if (chip) chip.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [idx, mode, letterCat])

  /* ── Keyboard navigation ──────────────────────────────── */
  useEffect(() => {
    const handler = e => {
      if (e.key === 'ArrowRight') setIdx(i => Math.min(i + 1, items.length - 1))
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [items.length, setIdx])

  const switchMode = m => { setMode(m); setWordIdx(0); setLetterIdx(0) }
  const switchLetterCat = cat => { setLetterCat(cat); setLetterIdx(0) }

  function handleCheck() {
    setToast(true)
    setTimeout(() => setToast(false), 1900)
  }

  /* ── Loading guard ────────────────────────────────────── */
  if (wordsLoading || lettersLoading || !current) {
    return (
      <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#FBF4E4' }}>
        <div style={{ fontSize: 48, animation: 'tvRise 1s infinite alternate' }}>✏️</div>
        <p style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink }}>Loading…</p>
      </div>
    )
  }

  const isLetterMode = mode === 'letters'
  const catInfo = LETTER_CATS.find(c => c.key === letterCat)

  return (
    <div style={{ minHeight: '100svh', position: 'relative' }}>
      <DotField />
      <TVPage>

        {/* ── Page header ──────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Practice</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>
            Letter Tracing
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>
            Follow the golden guide. Lift, breathe, trace — your stroke becomes the letter.
          </p>
        </div>

        {/* ── Mode toggle: Letters / Words ─────────────────────── */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {['letters', 'words'].map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              style={{
                fontFamily: T.sans, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                padding: '9px 22px', borderRadius: 999, border: 'none',
                background: mode === m ? T.ink : T.white,
                color: mode === m ? '#fff' : T.inkSoft,
                boxShadow: mode === m ? '0 8px 20px -10px rgba(58,30,156,0.6)' : `0 0 0 1.5px ${T.border}`,
                transition: 'all .2s',
              }}
            >
              {m === 'letters' ? '🔤 Letters' : '📚 Words'}
            </button>
          ))}
        </div>

        {/* ── Letter category sub-tabs ─────────────────────────── */}
        {isLetterMode && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            {LETTER_CATS.map(cat => (
              <button
                key={cat.key}
                onClick={() => switchLetterCat(cat.key)}
                style={{
                  fontFamily: T.sans, fontWeight: 800, fontSize: 13, cursor: 'pointer',
                  padding: '7px 20px', borderRadius: 999, border: 'none',
                  background: letterCat === cat.key ? `${T.orange}18` : 'transparent',
                  color: letterCat === cat.key ? T.orange : T.inkSoft,
                  boxShadow: letterCat === cat.key ? `0 0 0 1.5px ${T.orange}55` : `0 0 0 1.5px ${T.border}`,
                  transition: 'all .18s',
                }}
              >
                {cat.label} · <span style={{ fontFamily: T.te }}>{cat.labelTe}</span> ({letterData.length})
              </button>
            ))}
          </div>
        )}

        {/* ── Main 2-col layout ─────────────────────────────────── */}
        <div className="tv-trace-grid" style={{ paddingBottom: 10 }}>

          {/* Left: item picker */}
          <TVCard style={{ padding: 22, animation: 'tvRise .5s .05s both' }}>
            <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: T.orange, marginBottom: 16 }}>
              {isLetterMode
                ? <>{catInfo.label} · <span style={{ fontFamily: T.te }}>{catInfo.labelTe}</span></>
                : 'Words · పదాలు'
              }
            </div>

            {/* Chip grid */}
            <div
              ref={chipStripRef}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                maxHeight: 360,
                overflowY: 'auto',
                scrollbarWidth: 'thin',
              }}
            >
              {items.map((item, i) => {
                const selected = i === idx
                return (
                  <button
                    key={item.id}
                    data-selected={selected ? 'true' : 'false'}
                    onClick={() => setIdx(() => i)}
                    style={{
                      aspectRatio: isLetterMode ? '1' : 'auto',
                      minHeight: isLetterMode ? 'auto' : 44,
                      borderRadius: 18, cursor: 'pointer', border: 'none',
                      background: selected ? T.orange : '#FCEFE0',
                      color: selected ? '#fff' : T.ink,
                      fontFamily: isLetterMode ? T.te : T.sans,
                      fontWeight: 700,
                      fontSize: isLetterMode ? 26 : 13,
                      boxShadow: selected ? '0 10px 20px -8px rgba(240,86,14,0.6)' : 'none',
                      transition: 'transform .15s, background .2s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexDirection: 'column', gap: 2, padding: isLetterMode ? 4 : '6px 8px',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { if (!selected) e.currentTarget.style.background = '#FBE3CF' }}
                    onMouseLeave={e => { if (!selected) e.currentTarget.style.background = '#FCEFE0' }}
                  >
                    {isLetterMode ? (
                      item.telugu
                    ) : (
                      <>
                        <span style={{ fontSize: 16 }}>{item.emoji}</span>
                        <span style={{ fontSize: 10, fontFamily: T.sans, color: selected ? 'rgba(255,255,255,0.9)' : T.inkSoft, fontWeight: 800 }}>
                          {item.english}
                        </span>
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </TVCard>

          {/* Right: canvas card */}
          <TVCard style={{ padding: 28, position: 'relative', overflow: 'visible', animation: 'tvRise .5s .12s both' }}>
            {/* Reset button — top right, outside the card's overflow */}
            <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: T.orange }}>
              Now tracing
            </div>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 28, color: T.ink, margin: '6px 0 22px' }}>
              {isLetterMode ? (
                <>
                  Letter{' '}
                  <span style={{ fontFamily: T.te }}>{current.telugu}</span>
                  {current.roman && (
                    <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.inkSoft }}> · {current.roman}</span>
                  )}
                </>
              ) : (
                <>
                  <span style={{ fontSize: 22 }}>{current.emoji}</span>{' '}
                  {current.english}
                  <span style={{ fontFamily: T.te, fontSize: 22, fontWeight: 700, color: T.inkSoft, marginLeft: 12 }}>{current.telugu}</span>
                </>
              )}
            </h2>

            {/* Canvas area with dashed orange border */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 28, border: `2.5px dashed rgba(240,86,14,0.4)`,
                background: 'linear-gradient(180deg, rgba(252,230,214,0.35), rgba(255,253,248,0.4))',
                overflow: 'hidden',
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97, position: 'absolute', width: '100%' }}
                    transition={{ duration: 0.2 }}
                  >
                    <InteractiveCanvas word={current} letterMode={isLetterMode} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div style={{
                textAlign: 'center', marginTop: 8,
                fontFamily: T.sans, fontWeight: 800, fontSize: 11.5,
                letterSpacing: 2.4, textTransform: 'uppercase', color: T.inkSoft, opacity: 0.6,
              }}>
                Trace inside the golden guide
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
              <TVButton onClick={handleCheck}>✓ Check stroke</TVButton>
              <TVButton variant="ghost" onClick={() => speakWord(current.telugu)}>▶ Hear {isLetterMode ? 'letter' : 'word'}</TVButton>
            </div>

            {/* Prev / Next */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              <button
                onClick={() => setIdx(i => Math.max(i - 1, 0))}
                disabled={idx === 0}
                style={{
                  fontFamily: T.sans, fontWeight: 800, fontSize: 14, cursor: idx === 0 ? 'not-allowed' : 'pointer',
                  padding: '9px 20px', borderRadius: 999, border: 'none',
                  background: idx === 0 ? '#F1F5F9' : T.peach,
                  color: idx === 0 ? '#CBD5E1' : T.orange,
                  transition: 'all .18s',
                }}
              >
                ← Prev
              </button>
              <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 14, color: T.inkSoft }}>
                {idx + 1} / {items.length}
              </span>
              <button
                onClick={() => setIdx(i => Math.min(i + 1, items.length - 1))}
                disabled={idx === items.length - 1}
                style={{
                  fontFamily: T.sans, fontWeight: 800, fontSize: 14, cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer',
                  padding: '9px 20px', borderRadius: 999, border: 'none',
                  background: idx === items.length - 1 ? T.orange : T.orange,
                  color: '#fff',
                  boxShadow: idx === items.length - 1 ? 'none' : '0 8px 18px -8px rgba(240,86,14,0.6)',
                  opacity: idx === items.length - 1 ? 0.4 : 1,
                  transition: 'all .18s',
                }}
              >
                Next →
              </button>
            </div>

            {/* Success toast */}
            {toast && (
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: '#2E9E5B', color: '#fff',
                fontFamily: T.sans, fontWeight: 800, fontSize: 14,
                padding: '12px 18px', borderRadius: 14,
                boxShadow: '0 14px 26px -12px rgba(46,158,91,0.7)',
                animation: 'tvPop .3s both',
              }}>
                ✦ Beautiful! +5 stars
              </div>
            )}
          </TVCard>
        </div>

      </TVPage>
      <TVFooter />
    </div>
  )
}
