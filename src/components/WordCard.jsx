import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import TracingCanvas from './TracingCanvas'
import Sparkle from './Sparkle'

export default function WordCard({ word, speed, wordNumber, total }) {
  const [showSparkle, setShowSparkle] = useState(false)
  const replayRef = useRef(null)

  const handleComplete = useCallback(() => {
    setShowSparkle(true)
    setTimeout(() => setShowSparkle(false), 1400)
  }, [])

  const handleReplay = () => replayRef.current?.()

  return (
    <motion.div
      key={word.id}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -16 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl overflow-hidden"
      style={{ boxShadow: `0 8px 40px ${word.glow}55, 0 2px 8px #0000001a` }}
    >
      {/* Top accent stripe */}
      <div
        className="h-1.5 w-full"
        style={{ background: `linear-gradient(90deg, ${word.glow}, ${word.color})` }}
      />

      <div className="p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl text-4xl shrink-0"
              style={{ background: word.light }}
            >
              {word.emoji}
            </div>
            <div>
              <h2 className="baloo text-3xl font-extrabold text-gray-900 leading-none mb-1">
                {word.english}
              </h2>
              <p className="text-sm text-gray-400 font-semibold">{word.hint}</p>
            </div>
          </div>

          {/* Telugu label chip */}
          <div
            className="telugu text-2xl font-bold px-4 py-2 rounded-2xl shrink-0 ml-3"
            style={{ color: word.color, background: word.light }}
          >
            {word.telugu}
          </div>
        </div>

        {/* Tracing area */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${word.light}, white)`,
            border: `2px dashed ${word.color}40`,
          }}
        >
          {/* "Watch & Trace" label */}
          <div className="absolute top-3 left-4 flex items-center gap-1.5">
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

          <Sparkle visible={showSparkle} />
        </div>

        {/* Bottom row: word counter + replay */}
        <div className="flex items-center justify-between mt-5">
          <span className="text-xs font-semibold text-gray-400">
            Word {wordNumber} of {total}
          </span>
          <motion.button
            onClick={handleReplay}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-colors"
            style={{
              color: word.color,
              background: word.light,
              border: `2px solid ${word.color}40`,
            }}
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
