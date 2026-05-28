import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import TracingCanvas from './TracingCanvas'
import Sparkle from './Sparkle'

export default function LetterCard({ letter, speed, letterNumber, total }) {
  const [showSparkle, setShowSparkle] = useState(false)
  const replayRef = useRef(null)

  const handleComplete = useCallback(() => {
    setShowSparkle(true)
    setTimeout(() => setShowSparkle(false), 1400)
  }, [])

  const isVowel = letter.category === 'vowel'

  return (
    <motion.div
      key={letter.id}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -16 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl overflow-hidden"
      style={{ boxShadow: `0 8px 40px ${letter.glow}55, 0 2px 8px #0000001a` }}
    >
      {/* Accent stripe */}
      <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${letter.glow}, ${letter.color})` }} />

      <div className="px-6 pt-5 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Category badge */}
            <span
              className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-widest"
              style={{ background: letter.light, color: letter.color }}
            >
              {isVowel ? 'Vowel' : 'Consonant'}
            </span>
            <span className="text-sm text-gray-400 font-semibold">{letter.hint}</span>
          </div>

          {/* Roman transliteration — large display */}
          <div
            className="baloo text-4xl font-extrabold leading-none px-4 py-2 rounded-2xl"
            style={{ color: letter.color, background: letter.light }}
          >
            {letter.roman}
          </div>
        </div>

        {/* Tracing area */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${letter.light}, white)`,
            border: `2px dashed ${letter.color}40`,
          }}
        >
          {/* Pulsing dot indicator */}
          <div className="absolute top-3 left-4 flex items-center gap-1.5">
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

          <Sparkle visible={showSparkle} />
        </div>

        {/* Footer */}
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
