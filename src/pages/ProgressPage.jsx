/**
 * ProgressPage.jsx — Practice Progress Tracker
 *
 * GET    /api/progress      → show all logged sessions
 * POST   /api/progress      → log a practice session for a word
 * PUT    /api/progress/:id  → cycle stars (1 → 2 → 3 → 1)
 * DELETE /api/progress      → reset all progress
 * DELETE /api/progress/:id  → remove a single entry
 *
 * Visual: Telugu Vani premium design — stat cards, milestones, practice log.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWords } from '../hooks/useData'
import { T, DotField, Eyebrow, TVButton, TVCard, TVPage, TVFooter } from '../components/TV'

// Static milestone data (visual showcase)
const MILESTONES = [
  { t: 'First letter traced',     when: 'Day 1',  done: true  },
  { t: '10 letters mastered',     when: 'Day 4',  done: true  },
  { t: 'First shloka recited',    when: 'Day 7',  done: true  },
  { t: 'All vowels complete',     when: 'Day 12', done: false },
  { t: 'Ganesha shloka mastered', when: 'Soon',   done: false },
]

export default function ProgressPage() {
  const { words }               = useWords()
  const [logs,    setLogs]      = useState([])
  const [loading, setLoading]   = useState(true)
  const [refresh, setRefresh]   = useState(0)
  const [toast,   setToast]     = useState(null)
  const [wordPick, setWordPick] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/progress')
      .then(r => r.json())
      .then(data => { setLogs(data); setLoading(false) })
  }, [refresh])

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2000)
  }

  const handleLog = async () => {
    if (!wordPick) return showToast('Pick a word first', false)
    const res = await fetch('/api/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word_id: Number(wordPick), stars: 1 }),
    })
    if (res.ok) { setRefresh(r => r + 1); showToast('✅ Practice logged!') }
  }

  const cycleStars = async log => {
    const next = (log.stars % 3) + 1
    const res  = await fetch(`/api/progress/${log.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stars: next }),
    })
    if (res.ok) setRefresh(r => r + 1)
  }

  const deleteOne = async id => {
    const res = await fetch(`/api/progress/${id}`, { method: 'DELETE' })
    if (res.ok) { setRefresh(r => r + 1); showToast('🗑️ Entry removed') }
  }

  const resetAll = async () => {
    if (!window.confirm('Reset ALL progress? This cannot be undone.')) return
    const res = await fetch('/api/progress', { method: 'DELETE' })
    if (res.ok) { setRefresh(r => r + 1); showToast('🔄 Progress reset!') }
  }

  const totalSessions = logs.length
  const uniqueWords   = new Set(logs.map(l => l.word_id)).size
  const avgStars      = logs.length ? (logs.reduce((s, l) => s + l.stars, 0) / logs.length).toFixed(1) : '—'

  const STATS = [
    { icon: '🔥', n: String(Math.max(totalSessions, 0)), label: 'Sessions logged' },
    { icon: '✍️', n: String(uniqueWords),                label: 'Unique words'    },
    { icon: '⭐',  n: avgStars,                           label: 'Avg stars'       },
    { icon: '🏆', n: String(Math.max(uniqueWords, 0)),   label: 'Words practiced' },
  ]

  return (
    <div style={{ minHeight: '100svh', position: 'relative' }}>
      <DotField />

      {/* ── Toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
              padding: '12px 24px', borderRadius: 999, fontFamily: T.sans, fontWeight: 800, fontSize: 14,
              color: '#fff', background: toast.ok ? T.ink : '#EF4444', boxShadow: '0 12px 28px -10px rgba(36,26,85,0.5)',
            }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <TVPage>
        {/* ── Header ─────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Your journey</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>
            Progress
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>
            Tiny daily steps. Beautiful, lifelong fluency.
          </p>
        </div>

        {/* ── Stat cards ─────────────────────────────────────────── */}
        <div className="tv-stats" style={{ animation: 'tvRise .5s .06s both' }}>
          {STATS.map((s, i) => (
            <TVCard key={i} style={{ padding: 24, animation: `tvRise .5s ${0.06 * i}s both` }}>
              <div style={{ fontSize: 26, marginBottom: 14 }}>{s.icon}</div>
              <div style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 42, color: T.ink, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft, marginTop: 10 }}>{s.label}</div>
            </TVCard>
          ))}
        </div>

        {/* ── Milestones ─────────────────────────────────────────── */}
        <TVCard style={{ padding: 'clamp(26px,3vw,40px)', marginTop: 28, animation: 'tvRise .5s .2s both' }}>
          <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 28, color: T.ink, margin: '0 0 22px' }}>Milestones</h2>
          <div style={{ position: 'relative' }}>
            {MILESTONES.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0', position: 'relative' }}>
                <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    background: m.done ? T.orange : T.peach,
                    border: m.done ? 'none' : `2px solid ${T.peach}`,
                    display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 800,
                  }}>
                    {m.done ? '✓' : ''}
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div style={{ position: 'absolute', left: 12, top: 26, width: 2, height: 30, background: m.done ? 'rgba(240,86,14,0.35)' : T.peach }} />
                  )}
                </div>
                <div style={{ flex: 1, fontFamily: T.serif, fontWeight: 700, fontSize: 19, color: m.done ? T.ink : T.inkSoft }}>{m.t}</div>
                <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft }}>{m.when}</div>
              </div>
            ))}
          </div>
        </TVCard>

        {/* ── Log Practice ───────────────────────────────────────── */}
        <TVCard style={{ padding: 'clamp(24px,3vw,36px)', marginTop: 28, animation: 'tvRise .5s .25s both' }}>
          <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink, margin: '0 0 18px' }}>Log a Practice Session</h2>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              style={{
                flex: 1, minWidth: 180, border: `1.5px solid ${T.border}`, borderRadius: 14,
                padding: '12px 16px', fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink,
                background: T.white, outline: 'none', cursor: 'pointer',
              }}
              value={wordPick}
              onChange={e => setWordPick(e.target.value)}
            >
              <option value="">— Pick a word —</option>
              {words.map(w => (
                <option key={w.id} value={w.id}>{w.emoji} {w.telugu} ({w.english})</option>
              ))}
            </select>
            <TVButton onClick={handleLog}>Log →</TVButton>
          </div>
        </TVCard>

        {/* ── Practice log ──────────────────────────────────────── */}
        <TVCard style={{ overflow: 'hidden', marginTop: 20, animation: 'tvRise .5s .3s both' }}>
          <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}` }}>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink, margin: 0 }}>
              Practice Log <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.inkSoft }}>({totalSessions} sessions)</span>
            </h2>
            {logs.length > 0 && (
              <button onClick={resetAll} style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 13, cursor: 'pointer', padding: '8px 16px', borderRadius: 999, border: 'none', background: '#FEF2F2', color: '#EF4444' }}>
                Reset All
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 28 }}>⏳</div>
            </div>
          ) : logs.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 0', gap: 12 }}>
              <span style={{ fontSize: 40 }}>📭</span>
              <p style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.inkSoft, margin: 0 }}>No practice sessions yet</p>
              <p style={{ fontFamily: T.sans, fontSize: 13, color: T.inkSoft, opacity: 0.6, margin: 0 }}>Use the form above to log your first one!</p>
            </div>
          ) : (
            <div>
              {logs.map(log => (
                <motion.div key={log.id} layout style={{ padding: '16px 28px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 22, width: 32, textAlign: 'center' }}>{log.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontFamily: T.te, fontSize: 18, fontWeight: 700, color: log.color ?? T.ink }}>{log.telugu}</span>
                    <span style={{ fontFamily: T.sans, fontSize: 13, color: T.inkSoft, fontWeight: 600, marginLeft: 8 }}>{log.english}</span>
                    <p style={{ fontFamily: T.sans, fontSize: 12, color: T.inkSoft, opacity: 0.6, margin: '2px 0 0' }}>
                      {new Date(log.practiced_at).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => cycleStars(log)} style={{ fontSize: 17, background: 'none', border: 'none', cursor: 'pointer' }} title="Click to update stars">
                    {'⭐'.repeat(log.stars)}{'☆'.repeat(3 - log.stars)}
                  </button>
                  <button onClick={() => deleteOne(log.id)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#EF4444', fontWeight: 800, fontSize: 12 }} title="Remove">
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </TVCard>
      </TVPage>
      <TVFooter />
    </div>
  )
}
