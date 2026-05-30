/**
 * NavBar.jsx — Persistent top navigation bar
 *
 * Uses React Router's useLocation() to know which page we're on,
 * then highlights the active tab. Link handles navigation without
 * a full page reload (SPA behaviour).
 */

import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const TABS = [
  { path: '/',         label: 'Home',     icon: '🏠' },
  { path: '/tracing',  label: 'Tracing',  icon: '✏️' },
  { path: '/shlokas',  label: 'Shlokas',  icon: '🕉️' },
  { path: '/admin',    label: 'Admin',    icon: '⚙️' },
  { path: '/progress', label: 'Progress', icon: '🏆' },
]

// One accent colour per page so the nav feels alive
const PAGE_COLORS = {
  '/':         '#F59E0B',
  '/tracing':  '#E11D48',
  '/shlokas':  '#EA580C',
  '/admin':    '#6366F1',
  '/progress': '#10B981',
}

export default function NavBar() {
  const { pathname } = useLocation()
  const accentColor = PAGE_COLORS[pathname] ?? '#6366F1'

  return (
    <div
      className="sticky top-0 z-50 w-full flex justify-center px-4 py-3"
      style={{
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {TABS.map((tab) => {
          const active = pathname === tab.path
          return (
            <motion.div key={tab.path} whileTap={{ scale: 0.93 }}>
              <Link
                to={tab.path}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-extrabold transition-all"
                style={
                  active
                    ? {
                        background: accentColor,
                        color: 'white',
                        boxShadow: `0 4px 14px ${accentColor}55`,
                      }
                    : {
                        background: 'white',
                        color: '#94A3B8',
                        border: '2px solid #E8ECF0',
                      }
                }
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
