import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import InteractiveCanvas from '../components/InteractiveCanvas'
import { useSpeech } from '../hooks/useSpeech'
import { words } from '../data/words'

// అమ్మ — Mother (id: 1)
const AMMA = words.find((w) => w.id === 1)

export default function TracingPage() {
  const { speak, muted, toggleMute } = useSpeech()

  // Say the word as soon as the page opens
  useEffect(() => {
    const t = setTimeout(() => speak(AMMA), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="min-h-screen py-4 px-4"
      style={{ background: 'linear-gradient(160deg, #FFF1F2 0%, #FFF5F5 45%, #FFF8F9 100%)' }}
    >
      {/* Soft dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${AMMA.glow}44 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-xl mx-auto flex flex-col gap-5">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between pt-6">
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-extrabold px-4 py-2 rounded-full"
              style={{ color: AMMA.color, background: AMMA.light, border: `2px solid ${AMMA.color}30` }}
            >
              ← Go Home
            </Link>
          </motion.div>

          <span
            className="text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full"
            style={{ color: AMMA.color, background: `${AMMA.color}15` }}
          >
            ✏️ Tracing Guide
          </span>
        </div>

        {/* ── Word identity ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4 px-5 py-4 rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${AMMA.color}18, ${AMMA.light})` }}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl"
            style={{ filter: `drop-shadow(0 4px 10px ${AMMA.glow}aa)` }}
          >
            {AMMA.emoji}
          </motion.span>
          <div>
            <h2 className="baloo text-3xl font-black leading-none" style={{ color: AMMA.color }}>
              {AMMA.english}
            </h2>
            <p className="text-sm font-semibold mt-0.5" style={{ color: `${AMMA.color}99` }}>
              {AMMA.hint}
            </p>
          </div>
          <div
            className="telugu text-3xl font-extrabold px-4 py-2 rounded-2xl ml-auto"
            style={{ color: AMMA.color, background: `${AMMA.color}15` }}
          >
            {AMMA.telugu}
          </div>
        </motion.div>

        {/* ── Stroke guide card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: `0 10px 40px ${AMMA.glow}44, 0 3px 10px #00000010` }}
        >
          {/* Colour accent stripe */}
          <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${AMMA.glow}, ${AMMA.color})` }} />

          <div className="px-5 pt-5 pb-4">
            {/* Card header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: AMMA.color }} />
              <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: `${AMMA.color}99` }}>
                Trace on paper below the screen
              </span>
            </div>

            {/* The stroke guide SVG */}
            <div
              className="rounded-2xl overflow-hidden px-2 py-1"
              style={{
                background: `linear-gradient(135deg, ${AMMA.light}, white)`,
                border: `2px dashed ${AMMA.color}35`,
              }}
            >
              <InteractiveCanvas word={AMMA} onSpeak={() => speak(AMMA)} />
            </div>
          </div>
        </motion.div>

        <p className="text-center text-xs pb-6" style={{ color: `${AMMA.color}55` }}>
          Trace on paper below the screen · Practice makes perfect 🌟
        </p>
      </div>
    </div>
  )
}
