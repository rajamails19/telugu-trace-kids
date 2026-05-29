import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StrokeGuide from '../components/StrokeGuide'
import { words } from '../data/words'

// అమ్మ — Mother (id: 1)
const AMMA = words.find((w) => w.id === 1)

// Legend step component
function Step({ number, color, text }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm shrink-0"
        style={{ background: color }}
      >
        {number}
      </div>
      <span className="text-sm font-semibold text-gray-600">{text}</span>
    </div>
  )
}

export default function TracingPage() {
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
                Follow the numbers — trace on paper
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
              <StrokeGuide word={AMMA} />
            </div>
          </div>
        </motion.div>

        {/* ── Legend ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
          className="bg-white rounded-2xl px-5 py-4"
          style={{ boxShadow: '0 4px 16px #0000000a', border: '1.5px solid #FDE68A' }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600/60 mb-3">
            How to trace
          </p>
          <div className="flex flex-col gap-2.5">
            <Step number="1" color="#10B981" text="Start your pencil at the green ① dot" />
            <Step number="2" color="#3B82F6" text="Move in the direction of the arrow" />
            <Step number="3" color="#8B5CF6" text="Lift pen — then go to the next number" />
            <Step number="4" color="#F59E0B" text="Repeat slowly until the word is complete" />
          </div>
        </motion.div>

        <p className="text-center text-xs pb-6" style={{ color: `${AMMA.color}55` }}>
          Trace on paper below the screen · Practice makes perfect 🌟
        </p>
      </div>
    </div>
  )
}
