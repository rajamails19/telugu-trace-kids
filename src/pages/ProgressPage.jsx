/**
 * ProgressPage.jsx — Practice Progress Tracker
 *
 * GET    /api/progress      → show all logged sessions
 * POST   /api/progress      → log a practice session for a word
 * PUT    /api/progress/:id  → cycle stars (1 → 2 → 3 → 1)
 * DELETE /api/progress      → reset all progress
 * DELETE /api/progress/:id  → remove a single entry
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWords } from '../hooks/useData'

const ACCENT = '#10B981'
const LIGHT  = '#ECFDF5'

export default function ProgressPage() {
  const { words }                   = useWords()
  const [logs,      setLogs]        = useState([])
  const [loading,   setLoading]     = useState(true)
  const [refresh,   setRefresh]     = useState(0)
  const [toast,     setToast]       = useState(null)
  const [wordPick,  setWordPick]    = useState('')   // for "Log Practice" dropdown

  // ── Fetch progress logs ─────────────────────────────────────────────────────
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

  // ── POST: log a practice session ────────────────────────────────────────────
  const handleLog = async () => {
    if (!wordPick) return showToast('Pick a word first', false)
    const res = await fetch('/api/progress', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ word_id: Number(wordPick), stars: 1 }),
    })
    if (res.ok) {
      setRefresh(r => r + 1)
      showToast('✅ Practice logged!')
    }
  }

  // ── PUT: cycle stars 1→2→3→1 ───────────────────────────────────────────────
  const cycleStars = async (log) => {
    const next = (log.stars % 3) + 1
    const res = await fetch(`/api/progress/${log.id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ stars: next }),
    })
    if (res.ok) setRefresh(r => r + 1)
  }

  // ── DELETE one entry ────────────────────────────────────────────────────────
  const deleteOne = async (id) => {
    const res = await fetch(`/api/progress/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setRefresh(r => r + 1)
      showToast('🗑️ Entry removed')
    }
  }

  // ── DELETE all (reset) ──────────────────────────────────────────────────────
  const resetAll = async () => {
    if (!window.confirm('Reset ALL progress? This cannot be undone.')) return
    const res = await fetch('/api/progress', { method: 'DELETE' })
    if (res.ok) {
      setRefresh(r => r + 1)
      showToast('🔄 Progress reset!')
    }
  }

  // ── Derived stats ───────────────────────────────────────────────────────────
  const totalSessions = logs.length
  const uniqueWords   = new Set(logs.map(l => l.word_id)).size
  const avgStars      = logs.length ? (logs.reduce((s, l) => s + l.stars, 0) / logs.length).toFixed(1) : '—'

  return (
    <div className="min-h-screen pb-16" style={{ background: `linear-gradient(160deg, ${LIGHT} 0%, #ffffff 60%, ${LIGHT} 100%)` }}>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white text-sm font-extrabold shadow-xl"
            style={{ background: toast.ok ? ACCENT : '#EF4444' }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-6">

        {/* ── Title ────────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black" style={{ color: ACCENT }}>🏆 Progress Tracker</h1>
            <p className="text-sm font-semibold text-slate-400 mt-0.5">Track which words you've practiced</p>
          </div>
          {logs.length > 0 && (
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-full text-xs font-extrabold"
              style={{ background: '#FEF2F2', color: '#EF4444' }}
            >
              Reset All
            </button>
          )}
        </div>

        {/* ── Stats row ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions',     value: totalSessions },
            { label: 'Unique Words', value: uniqueWords },
            { label: 'Avg ⭐',       value: avgStars },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white rounded-2xl py-4 text-center"
              style={{ boxShadow: `0 4px 16px ${ACCENT}18`, border: `1.5px solid ${ACCENT}20` }}
            >
              <div className="text-2xl font-black" style={{ color: ACCENT }}>{value}</div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Log Practice (POST) ──────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-3xl p-5 flex gap-3 items-end"
          style={{ boxShadow: `0 8px 30px ${ACCENT}18`, border: `1.5px solid ${ACCENT}20` }}
        >
          <div className="flex-1">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>Log a Practice Session</p>
            <select
              className="w-full border-2 rounded-xl px-3 py-2 text-sm font-semibold outline-none"
              style={{ borderColor: '#E2E8F0' }}
              value={wordPick}
              onChange={e => setWordPick(e.target.value)}
            >
              <option value="">— Pick a word —</option>
              {words.map(w => (
                <option key={w.id} value={w.id}>
                  {w.emoji} {w.telugu} ({w.english})
                </option>
              ))}
            </select>
          </div>
          <motion.button
            onClick={handleLog}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 rounded-full text-sm font-extrabold text-white shrink-0"
            style={{ background: ACCENT, boxShadow: `0 4px 14px ${ACCENT}55` }}
          >
            Log →
          </motion.button>
        </div>

        {/* ── Progress log list (GET + PUT stars + DELETE) ─────────────────────── */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 20px #00000010' }}>
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Practice Log ({totalSessions} sessions)
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="text-2xl animate-bounce">⏳</div>
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 gap-3">
              <span className="text-4xl">📭</span>
              <p className="text-sm font-semibold text-slate-400">No practice sessions yet</p>
              <p className="text-xs text-slate-300">Use the form above to log your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  layout
                  className="px-5 py-3 flex items-center gap-3"
                >
                  <span className="text-xl w-8 text-center">{log.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <span className="telugu text-base font-extrabold" style={{ color: log.color }}>{log.telugu}</span>
                    <span className="text-xs text-slate-400 font-semibold ml-2">{log.english}</span>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {new Date(log.practiced_at).toLocaleString()}
                    </p>
                  </div>
                  {/* Stars — click to cycle (PUT) */}
                  <button
                    onClick={() => cycleStars(log)}
                    className="text-lg font-bold transition-transform hover:scale-110"
                    title="Click to update stars"
                  >
                    {'⭐'.repeat(log.stars)}{'☆'.repeat(3 - log.stars)}
                  </button>
                  {/* Delete entry */}
                  <button
                    onClick={() => deleteOne(log.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold"
                    style={{ background: '#FEF2F2', color: '#EF4444' }}
                    title="Remove entry"
                  >✕</button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
