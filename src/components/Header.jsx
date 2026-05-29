import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSpeech } from '../hooks/useSpeech'

export default function Header() {
  const { pathname }      = useLocation()
  const onHome            = pathname === '/'
  const { muted, toggleMute } = useSpeech()

  return (
    <header className="pt-6 pb-2 px-1">
      <div className="flex items-center justify-between mb-2">

        {/* Left: mute / unmute toggle */}
        <motion.button
          onClick={toggleMute}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.90 }}
          title={muted ? 'Tap to unmute' : 'Tap to mute'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-extrabold"
          style={{
            background: muted ? '#F1F5F9' : 'white',
            color:      muted ? '#94A3B8' : '#92400E',
            border:     `2px solid ${muted ? '#E2E8F0' : '#FDE68A'}`,
          }}
        >
          {muted
            ? <MuteIcon />
            : <SoundIcon />}
        </motion.button>

        {/* Centre title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none">✍️</span>
          <h1 className="baloo text-3xl md:text-4xl font-extrabold text-amber-900 leading-none">
            Telugu Trace Kids
          </h1>
        </div>

        {/* Right: Tracing link (home) or spacer (tracing page) */}
        {onHome ? (
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
            <Link
              to="/tracing"
              className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{ color: '#92400E', background: '#FDE68A', border: '2px solid #F59E0B44' }}
            >
              ✏️ Tracing
            </Link>
          </motion.div>
        ) : (
          <div className="w-20" />
        )}
      </div>

      <p className="text-center text-sm md:text-base font-semibold text-amber-700/70 tracking-wide">
        Watch slowly · Trace on paper · Practice daily
      </p>
    </header>
  )
}

function SoundIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  )
}

function MuteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
