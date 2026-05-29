import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Header() {
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  return (
    <header className="pt-6 pb-2 px-1">
      <div className="flex items-center justify-between mb-2">
        {/* Left spacer (mirrors Tracing link width) */}
        <div className="w-20" />

        {/* Centre title */}
        <div className="flex items-center gap-3">
          <span className="text-3xl select-none">✍️</span>
          <h1 className="baloo text-3xl md:text-4xl font-extrabold text-amber-900 leading-none">
            Telugu Trace Kids
          </h1>
        </div>

        {/* Right: Tracing link (only visible on home) */}
        {onHome ? (
          <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
            <Link
              to="/tracing"
              className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors"
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
