import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TracingCanvas from './TracingCanvas'

// Stable float params per slot — no Math.random() on render
const FLOAT_SLOTS = [
  { y: 12, duration: 4.2, delay: 0,   rotate: 12, style: { top: 10,  right: 22 } },
  { y: 8,  duration: 3.6, delay: 0.9, rotate: -8, style: { top: 44,  right: 64 } },
  { y: 16, duration: 5.0, delay: 1.7, rotate: 15, style: { bottom: 8, right: 36 } },
]

function FloatingDeco({ emoji, slot }) {
  return (
    <motion.span
      animate={{ y: [0, -slot.y, 0], rotate: [0, slot.rotate, 0] }}
      transition={{ duration: slot.duration, repeat: Infinity, ease: 'easeInOut', delay: slot.delay }}
      className="absolute pointer-events-none select-none text-3xl"
      style={{ opacity: 0.22, ...slot.style }}
    >
      {emoji}
    </motion.span>
  )
}

// Emoji burst on tracing completion
const BURST_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

function EmojiCelebration({ visible, emoji, color }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          {BURST_ANGLES.map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            const dist = 72
            return (
              <motion.span
                key={deg}
                initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
                animate={{ opacity: [1, 1, 0], scale: [0.3, 1.1, 0.7], x: Math.cos(rad) * dist, y: Math.sin(rad) * dist }}
                exit={{}}
                transition={{ duration: 0.75, delay: i * 0.04, ease: 'easeOut' }}
                className="absolute text-2xl"
                style={{ filter: `drop-shadow(0 2px 6px ${color}88)` }}
              >
                {emoji}
              </motion.span>
            )
          })}
          {/* Centre flash */}
          <motion.div
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: [0, 2.5, 0], opacity: [0.9, 0.5, 0] }}
            transition={{ duration: 0.6 }}
            className="absolute w-16 h-16 rounded-full"
            style={{ background: color }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}

export default function WordCard({ word, speed, wordNumber, total }) {
  const [showCelebration, setShowCelebration] = useState(false)
  const replayRef = useRef(null)

  const handleComplete = useCallback(() => {
    setShowCelebration(true)
    setTimeout(() => setShowCelebration(false), 900)
  }, [])

  const decos = word.deco ?? []

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -18 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl overflow-hidden"
      style={{ boxShadow: `0 14px 52px ${word.glow}55, 0 4px 14px #00000012` }}
    >
      {/* ── Hero section ── */}
      <div
        className="relative px-6 pt-7 pb-6 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${word.color}22 0%, ${word.glow}28 55%, ${word.light} 100%)`,
        }}
      >
        {/* Floating deco emoji */}
        {decos.map((emoji, i) => FLOAT_SLOTS[i] && (
          <FloatingDeco key={i} emoji={emoji} slot={FLOAT_SLOTS[i]} />
        ))}

        {/* Soft circle behind emoji */}
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          style={{ background: `${word.color}10` }}
        />

        <div className="relative flex items-center gap-5">
          {/* Big bouncing emoji */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl shrink-0 leading-none"
            style={{ filter: `drop-shadow(0 8px 18px ${word.glow}bb)` }}
          >
            {word.emoji}
          </motion.div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <span
              className="inline-block text-xs font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
              style={{ background: `${word.color}22`, color: word.color }}
            >
              {word.hint}
            </span>
            <h2
              className="baloo text-4xl font-black leading-none truncate"
              style={{ color: word.color }}
            >
              {word.english}
            </h2>
          </div>

          {/* Telugu chip */}
          <div
            className="telugu text-xl font-extrabold px-4 py-2.5 rounded-2xl shrink-0 self-start"
            style={{
              color: word.color,
              background: `${word.color}15`,
              border: `2px solid ${word.color}28`,
            }}
          >
            {word.telugu}
          </div>
        </div>
      </div>

      {/* ── Tracing area ── */}
      <div className="bg-white px-5 pb-5 pt-4">
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${word.light}, white)`,
            border: `2px dashed ${word.color}40`,
          }}
        >
          <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: word.color }} />
            <span className="text-xs font-bold opacity-50" style={{ color: word.color }}>
              Watch &amp; trace on paper
            </span>
          </div>

          <TracingCanvas
            word={word}
            speed={speed}
            onComplete={handleComplete}
            replayRef={replayRef}
          />

          <EmojiCelebration visible={showCelebration} emoji={word.emoji} color={word.color} />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs font-semibold text-gray-400">
            Word {wordNumber} of {total}
          </span>
          <motion.button
            onClick={() => replayRef.current?.()}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold"
            style={{ color: word.color, background: word.light, border: `2px solid ${word.color}40` }}
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
