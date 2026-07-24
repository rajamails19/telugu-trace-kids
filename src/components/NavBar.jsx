/**
 * NavBar.jsx — Sticky floating pill navigation for Telugu Vani.
 *
 * Design: warm-white pill with backdrop blur, brand mark on left,
 * centered nav links, gold-ring avatar on right.
 * Active link = peach background + orange text.
 * Hidden on mobile (< 900px) via .tv-navlinks CSS class.
 */

import { Link, useLocation } from 'react-router-dom'
import { T } from './TV'

const TABS = [
  { path: '/',         label: 'Home'     },
  { path: '/tracing',  label: 'Tracing'  },
  { path: '/shlokas',  label: 'Shlokas'  },
  { path: '/progress', label: 'Progress' },
  { path: '/admin',    label: 'Admin'    },
]

export default function NavBar() {
  const { pathname } = useLocation()

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '16px 24px 8px',
      display: 'flex', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      <nav style={{
        pointerEvents: 'auto',
        width: '100%', maxWidth: 1180,
        background: 'rgba(255,253,248,0.94)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderRadius: 999,
        padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 18px 40px -26px rgba(36,26,85,0.5), 0 1px 0 rgba(255,255,255,0.9) inset',
        border: '1px solid rgba(255,255,255,0.9)',
      }}>

        {/* ── Brand ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 11, textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            width: 38, height: 38, borderRadius: 13, background: T.orange,
            display: 'grid', placeItems: 'center',
            boxShadow: '0 8px 16px -7px rgba(240,86,14,0.7)',
          }}>
            <span style={{ fontFamily: T.te, color: '#fff', fontWeight: 700, fontSize: 20 }}>వ</span>
          </span>
          <span style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 20, color: T.ink, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
            Telugu Vani
          </span>
        </Link>

        {/* ── Center links (hidden < 900px via CSS class) ── */}
        <div className="tv-navlinks" style={{ alignItems: 'center', gap: 4, margin: '0 auto' }}>
          {TABS.map(tab => {
            const active = pathname === tab.path
            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  fontFamily: T.sans, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  padding: '9px 18px', borderRadius: 999,
                  background: active ? T.peach : 'transparent',
                  color: active ? T.orange : T.ink,
                  transition: 'background .2s, color .2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(58,30,156,0.05)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        {/* ── Avatar ── */}
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: `2.5px solid ${T.gold}`, background: '#FFF6E2',
          display: 'grid', placeItems: 'center',
          fontFamily: T.sans, fontWeight: 800, fontSize: 13, color: T.orange,
          flexShrink: 0,
        }}>
          SJ
        </div>
      </nav>
    </div>
  )
}
