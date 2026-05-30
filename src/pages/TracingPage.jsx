import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import InteractiveCanvas from '../components/InteractiveCanvas'
import { speakWord } from '../hooks/useSpeech'
import { useWords, useLetters } from '../hooks/useData'

export default function TracingPage() {
  // ── Data from backend API ──────────────────────────────────────────────────
  const { words, loading: wordsLoading }               = useWords()
  const { vowels, consonants, loading: lettersLoading } = useLetters()

  const LETTER_CATS = [
    { key: 'vowels',     label: 'Vowels',     data: vowels },
    { key: 'consonants', label: 'Consonants', data: consonants },
  ]

  const [mode, setMode]           = useState('words')
  const [letterCat, setLetterCat] = useState('vowels')
  const [wordIdx, setWordIdx]     = useState(0)
  const [letterIdx, setLetterIdx] = useState(0)

  const chipStripRef = useRef(null)

  /* ── derived state ─────────────────────────────────── */
  const letters = LETTER_CATS.find((c) => c.key === letterCat)?.data ?? []
  const items   = mode === 'words' ? words : letters
  const idx     = mode === 'words' ? wordIdx : letterIdx
  const setIdx  = useCallback(
    (fn) => mode === 'words' ? setWordIdx(fn) : setLetterIdx(fn),
    [mode],
  )
  const current = items[idx] ?? items[0]

  /* ── speak on item change ──────────────────────────── */
  useEffect(() => {
    if (!current) return          // guard: data hasn't arrived from API yet
    const t = setTimeout(() => speakWord(current.telugu), 500)
    return () => clearTimeout(t)
  }, [current?.id])               // ?. = optional chaining: undefined?.id = undefined (no crash)

  /* ── auto-scroll chip into view ───────────────────── */
  useEffect(() => {
    const strip = chipStripRef.current
    if (!strip) return
    const chip = strip.querySelector('[data-selected="true"]')
    if (chip) chip.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }, [idx, mode, letterCat])

  /* ── keyboard navigation ───────────────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, items.length - 1))
      if (e.key === 'ArrowLeft')  setIdx((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [items.length, setIdx])

  /* ── loading guard ────────────────────────────────── */
  if (wordsLoading || lettersLoading || !current) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF5F5 100%)' }}>
        <div className="text-5xl animate-bounce">✏️</div>
        <p className="font-extrabold text-lg" style={{ color: '#E11D48' }}>Loading…</p>
      </div>
    )
  }

  /* ── mode switch helpers ───────────────────────────── */
  const switchMode = (m) => {
    setMode(m)
    setWordIdx(0)
    setLetterIdx(0)
  }

  const switchLetterCat = (cat) => {
    setLetterCat(cat)
    setLetterIdx(0)
  }

  /* ── render ─────────────────────────────────────────── */
  return (
    <div
      className="min-h-screen pb-10"
      style={{
        background: `linear-gradient(160deg, ${current.light} 0%, #FFFFFF 55%, ${current.light} 100%)`,
        transition: 'background 0.5s ease',
      }}
    >
      {/* Dot grid backdrop — updates color with selection */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${current.glow}44 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
          transition: 'background-image 0.5s ease',
        }}
      />

      <div className="relative max-w-xl mx-auto px-4 flex flex-col gap-4">

        {/* ── Top bar ──────────────────────────────────── */}
        <div className="flex items-center justify-end pt-4">
          <span
            className="text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ color: current.color, background: `${current.color}15` }}
          >
            ✏️ Free Tracing
          </span>
        </div>

        {/* ── Mode tabs: Letters | Words ──────────────── */}
        <div
          className="flex gap-1.5 p-1.5 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)', boxShadow: '0 2px 12px #00000010' }}
        >
          {['letters', 'words'].map((m) => (
            <motion.button
              key={m}
              onClick={() => switchMode(m)}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-extrabold capitalize transition-all"
              style={
                mode === m
                  ? { background: current.color, color: 'white', boxShadow: `0 4px 14px ${current.glow}88` }
                  : { color: '#94A3B8', background: 'transparent' }
              }
            >
              {m === 'letters' ? '🔤 Letters' : '📚 Words'}
            </motion.button>
          ))}
        </div>

        {/* ── Letter sub-tabs: Vowels | Consonants ────── */}
        <AnimatePresence>
          {mode === 'letters' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex gap-2"
            >
              {LETTER_CATS.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => switchLetterCat(cat.key)}
                  className="flex-1 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all"
                  style={
                    letterCat === cat.key
                      ? { background: `${current.color}22`, color: current.color, border: `2px solid ${current.color}44` }
                      : { background: 'white', color: '#94A3B8', border: '2px solid #E2E8F0' }
                  }
                >
                  {cat.label} ({cat.data.length})
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Chip strip ──────────────────────────────── */}
        <div
          ref={chipStripRef}
          className="flex gap-2 overflow-x-auto py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, i) => {
            const selected = i === idx
            return (
              <motion.button
                key={item.id}
                data-selected={selected ? 'true' : 'false'}
                onClick={() => setIdx(() => i)}
                whileTap={{ scale: 0.9 }}
                className="shrink-0 flex flex-col items-center justify-center gap-0.5 rounded-2xl transition-all"
                style={
                  selected
                    ? {
                        background: item.color,
                        color: 'white',
                        boxShadow: `0 6px 18px ${item.glow}99`,
                        padding: '8px 12px',
                        minWidth: mode === 'words' ? 64 : 52,
                      }
                    : {
                        background: 'white',
                        color: '#94A3B8',
                        border: '2px solid #E8ECF0',
                        padding: '6px 10px',
                        minWidth: mode === 'words' ? 60 : 48,
                      }
                }
              >
                {mode === 'words' ? (
                  <>
                    <span className="text-xl leading-none">{item.emoji}</span>
                    <span
                      className="text-[10px] font-extrabold leading-none mt-1 max-w-[56px] truncate"
                      style={{ color: selected ? 'rgba(255,255,255,0.9)' : '#94A3B8' }}
                    >
                      {item.english}
                    </span>
                  </>
                ) : (
                  <span
                    className="telugu text-2xl font-extrabold leading-none"
                    style={{ color: selected ? 'white' : item.color }}
                  >
                    {item.telugu}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* ── Item identity card ──────────────────────── */}
        <AnimatePresence>
          <motion.div
            key={`${mode}-${current.id}`}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, position: 'absolute', width: '100%' }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {/* Identity header */}
            <div
              className="flex items-center gap-4 px-5 py-4 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${current.color}18 0%, ${current.light} 100%)`,
                border: `1.5px solid ${current.color}20`,
              }}
            >
              {/* Left: emoji for words, roman for letters */}
              {mode === 'words' ? (
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl shrink-0 leading-none"
                  style={{ filter: `drop-shadow(0 4px 10px ${current.glow}aa)` }}
                >
                  {current.emoji}
                </motion.span>
              ) : (
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="baloo shrink-0 font-black leading-none"
                  style={{ fontSize: '3rem', color: current.color, filter: `drop-shadow(0 4px 10px ${current.glow}cc)` }}
                >
                  {current.roman}
                </motion.div>
              )}

              {/* Middle: English / hint */}
              <div className="flex-1 min-w-0">
                {mode === 'words' ? (
                  <>
                    <h2 className="baloo text-3xl font-black leading-none truncate" style={{ color: current.color }}>
                      {current.english}
                    </h2>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: `${current.color}99` }}>
                      {current.hint}
                    </p>
                  </>
                ) : (
                  <>
                    <span
                      className="inline-block text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1"
                      style={{ background: `${current.color}22`, color: current.color }}
                    >
                      {current.category}
                    </span>
                    <p className="text-sm font-semibold" style={{ color: `${current.color}99` }}>
                      {current.hint}
                    </p>
                  </>
                )}
              </div>

              {/* Right: Telugu chip + speak button */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div
                  className="telugu text-2xl font-extrabold px-4 py-2 rounded-2xl"
                  style={{ color: current.color, background: `${current.color}15`, border: `2px solid ${current.color}25` }}
                >
                  {current.telugu}
                </div>
                <motion.button
                  onClick={() => speakWord(current.telugu)}
                  whileTap={{ scale: 0.88 }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: current.color, color: 'white', boxShadow: `0 3px 10px ${current.glow}88` }}
                  title="Hear it"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* ── Tracing canvas card ── */}
            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ boxShadow: `0 10px 40px ${current.glow}44, 0 3px 10px #00000010` }}
            >
              {/* Accent stripe */}
              <div
                className="h-1.5 w-full"
                style={{ background: `linear-gradient(90deg, ${current.glow}, ${current.color})` }}
              />

              <div className="px-5 pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: current.color }} />
                  <span className="text-xs font-bold opacity-50" style={{ color: current.color }}>
                    Draw on paper below the screen
                  </span>
                </div>

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${current.light}, white)`,
                    border: `2px dashed ${current.color}35`,
                  }}
                >
                  <InteractiveCanvas word={current} letterMode={mode === 'letters'} />
                </div>
              </div>
            </div>

            {/* ── Prev / Next navigation ── */}
            <div className="flex items-center justify-between px-1 pb-2">
              <motion.button
                onClick={() => setIdx((i) => Math.max(i - 1, 0))}
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
                {idx + 1} <span style={{ color: '#CBD5E1' }}>/</span> {items.length}
              </span>

              <motion.button
                onClick={() => setIdx((i) => Math.min(i + 1, items.length - 1))}
                disabled={idx === items.length - 1}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all"
                style={
                  idx === items.length - 1
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
          Telugu Trace Kids · Practice makes perfect 🌟
        </p>
      </div>
    </div>
  )
}
