import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TracingCanvas from './TracingCanvas'

const BURST_ANGLES = [0, 60, 120, 180, 240, 300]

function LetterCelebration({ visible, roman, color }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {BURST_ANGLES.map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const dist = 64
            return (
              <motion.span
                key={deg}
                initial={{ opacity: 1, scale: 0.4, x: 0, y: 0 }}
                animate={{ opacity: [1, 1, 0], scale: [0.4, 1.2, 0.7], x: Math.cos(rad) * dist, y: Math.sin(rad) * dist }}
                exit={{}}
                transition={{ duration: 0.7, delay: i * 0.05, ease: 'easeOut' }}
                className="absolute text-xl font-black"
                style={{ color, fontFamily: "'Baloo 2', sans-serif", filter: `drop-shadow(0 2px 4px ${color}88)` }}
              >
                {roman}
              </motion.span>
            )
          })}
          <motion.div
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: [0, 2.2, 0], opacity: [0.85, 0.4, 0] }}
            transition={{ duration: 0.55 }}
            className="absolute w-14 h-14 rounded-full"
            style={{ background: color }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}

export default function LetterCard({ letter, speed, letterNumber, total }) {
  const [showCelebration, setShowCelebration] = useState(false)
  const replayRef = useRef(null)

  const handleComplete = useCallback(() => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 900)
  }, [])

  const isVowel = letter.category === 'vowel'

  return (
    <motion.div
      key={letter.id}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -18 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl overflow-hidden"
      style={{ boxShadow: `0 14px 52px ${letter.glow}55, 0 4px 14px #00000012` }}
    >
      {/* ── Hero section ── */}
      <div
        className="relative px-6 pt-7 pb-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${letter.color}20 0%, ${letter.glow}28 55%, ${letter.light} 100%)`,
        }}
      >
        {/* Soft bg circles */}
        <div
          className="absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-30"
          style={{ background: `radial-gradient(circle, ${letter.glow}, transparent)` }}
        />
        <div
          className="absolute right-16 bottom-0 w-20 h-20 rounded-full opacity-20"
          style={{ background: `radial-gradient(circle, ${letter.color}, transparent)` }}
        />

        <div className="relative flex items-center gap-5">
          {/* Big roman transliteration — the visual "emoji" for letters */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="baloo shrink-0 font-black leading-none select-none"
            style={{
              fontSize: '5.5rem',
              color: letter.color,
              filter: `drop-shadow(0 6px 16px ${letter.glow}cc)`,
            }}
          >
            {letter.roman}
          </motion.div>

          {/* Info block */}
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
              style={{ background: `${letter.color}22`, color: letter.color }}
            >
              {isVowel ? 'Vowel' : 'Consonant'}
            </span>
            <p
              className="text-base font-bold leading-snug"
              style={{ color: `${letter.color}bb` }}
            >
              {letter.hint}
            </p>
          </div>

          {/* Telugu chip top-right */}
          <div
            className="telugu text-xl font-extrabold px-4 py-2.5 rounded-2xl shrink-0 self-start"
            style={{
              color: letter.color,
              background: `${letter.color}15`,
              border: `2px solid ${letter.color}28`,
            }}
          >
            {letter.telugu}
          </div>
        </div>
      </div>

      {/* ── Tracing area ── */}
      <div className="bg-white px-5 pb-5 pt-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${letter.light}, white)`,
            border: `2px dashed ${letter.color}40`,
          }}
        >
          <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: letter.color }} />
            <span className="text-xs font-bold opacity-50" style={{ color: letter.color }}>
              Watch &amp; trace on paper
            </span>
          </div>

          <TracingCanvas
            word={letter}
            speed={speed}
            onComplete={handleComplete}
            replayRef={replayRef}
            letterMode
          />

          <LetterCelebration visible={showCelebration} roman={letter.roman} color={letter.color} />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-semibold text-gray-400">
            {isVowel ? 'Vowel' : 'Consonant'} {letterNumber} of {total}
          </span>
          <motion.button
            onClick={() => replayRef.current?.()}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
            style={{ color: letter.color, background: letter.light, border: `2px solid ${letter.color}40` }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M1 4v6h6M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            Replay
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
