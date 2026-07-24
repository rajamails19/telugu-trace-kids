/**
 * AdminPage.jsx — Word Manager (Admin Panel)
 *
 * Add flow (2 steps):
 *   1. User types an English word (max 2 words)
 *   2. We call MyMemory free API → get Telugu translation
 *   3. Show preview card → user confirms → POST to our backend
 *
 * HTTP methods used:
 *   GET    /api/words        → fetch & display all words
 *   POST   /api/words        → add a translated word
 *   PUT    /api/words/:id    → inline edit
 *   DELETE /api/words/:id    → remove word
 *
 * Visual: Telugu Vani premium design — stat tiles, learner rows, word list.
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../hooks/useSpeech'
import { T, DotField, Eyebrow, TVButton, TVCard, TVPage, TVFooter } from '../components/TV'

async function translateToTelugu(english) {
  const res  = await fetch(`/api/translate?q=${encodeURIComponent(english)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Translation failed')
  return data.translated
}

function limitToTwoWords(value) {
  const words = value.trimStart().split(/\s+/)
  if (words.length > 2) return words.slice(0, 2).join(' ')
  return value
}

// Static learner showcase data
const LEARNERS = [
  { initial: 'S', name: 'Saanvi J.', streak: 12, letters: 28, shlokas: 6 },
  { initial: 'A', name: 'Arjun R.',  streak: 5,  letters: 14, shlokas: 2 },
  { initial: 'M', name: 'Meera P.',  streak: 21, letters: 42, shlokas: 9 },
]

export default function AdminPage() {
  const [words,        setWords]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [editId,       setEditId]       = useState(null)
  const [editForm,     setEditForm]     = useState({})
  const [refresh,      setRefresh]      = useState(0)
  const [toast,        setToast]        = useState(null)
  const [englishInput, setEnglishInput] = useState('')
  const [translating,  setTranslating]  = useState(false)
  const [preview,      setPreview]      = useState(null)

  useEffect(() => {
    setLoading(true)
    fetch('/api/words')
      .then(r => r.json())
      .then(data => { setWords(data); setLoading(false) })
  }, [refresh])

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 2500)
  }

  const handleTranslate = async () => {
    const eng = englishInput.trim()
    if (!eng) return showToast('Type a word first', false)
    setTranslating(true); setPreview(null)
    try {
      const telugu = await translateToTelugu(eng)
      setPreview({ telugu, english: eng })
    } catch {
      showToast('❌ Translation failed — check your internet', false)
    } finally {
      setTranslating(false)
    }
  }

  const handleConfirmAdd = async () => {
    if (!preview) return
    const res = await fetch('/api/words', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telugu: preview.telugu, english: preview.english, emoji: '📝', hint: `The word for ${preview.english}` }),
    })
    if (res.ok) { setEnglishInput(''); setPreview(null); setRefresh(r => r + 1); showToast(`✅ "${preview.english}" added!`) }
    else showToast('❌ Failed to save', false)
  }

  const handleEdit = async id => {
    const res = await fetch(`/api/words/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
    if (res.ok) { setEditId(null); setRefresh(r => r + 1); showToast('✅ Word updated!') }
    else showToast('❌ Failed to update', false)
  }

  const handleDelete = async (id, english) => {
    if (!window.confirm(`Delete "${english}"?`)) return
    const res = await fetch(`/api/words/${id}`, { method: 'DELETE' })
    if (res.ok) { setRefresh(r => r + 1); showToast(`🗑️ "${english}" deleted`) }
    else showToast('❌ Failed to delete', false)
  }

  const wordCount = englishInput.trim() === '' ? 0 : englishInput.trim().split(/\s+/).length

  const TILES = [
    { n: String(LEARNERS.length), label: 'Active learners' },
    { n: String(words.length),    label: 'Total words' },
    { n: '92%',                   label: 'Avg. accuracy' },
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
        {/* ── Header ──────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Dashboard</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>
            Admin
          </h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>
            A quiet workspace to shepherd your young learners.
          </p>
        </div>

        {/* ── 3 stat tiles ────────────────────────────────────────── */}
        <div className="tv-stats3" style={{ animation: 'tvRise .5s .06s both' }}>
          {TILES.map((t, i) => (
            <TVCard key={i} style={{ padding: 26, animation: `tvRise .5s ${0.06 * i}s both` }}>
              <div style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 44, color: T.ink, lineHeight: 1 }}>{t.n}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft, marginTop: 10 }}>{t.label}</div>
            </TVCard>
          ))}
        </div>

        {/* ── Learners showcase ─────────────────────────────────────── */}
        <TVCard style={{ marginTop: 28, overflow: 'hidden', animation: 'tvRise .5s .15s both' }}>
          <div style={{ padding: '22px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 26, color: T.ink, margin: 0 }}>Learners</h2>
            <TVButton style={{ padding: '10px 18px', fontSize: 14 }}>+ Add learner</TVButton>
          </div>
          {LEARNERS.map((l, i) => (
            <div key={i} className="tv-learner" style={{ padding: '18px 28px', borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ width: 40, height: 40, borderRadius: '50%', border: `2.5px solid ${T.gold}`, background: '#FFF6E2', display: 'grid', placeItems: 'center', fontFamily: T.sans, fontWeight: 800, fontSize: 15, color: T.orange, flexShrink: 0 }}>{l.initial}</span>
                <span style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 19, color: T.ink, whiteSpace: 'nowrap' }}>{l.name}</span>
              </div>
              <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.inkSoft }}>🔥 <strong style={{ color: T.ink }}>{l.streak}</strong> day streak</span>
              <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.inkSoft }}>✍️ {l.letters} letters</span>
              <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.inkSoft }}>🕉️ {l.shlokas} shlokas</span>
            </div>
          ))}
        </TVCard>

        {/* ── Add word card ──────────────────────────────────────────── */}
        <TVCard style={{ padding: 'clamp(24px,3vw,36px)', marginTop: 28, animation: 'tvRise .5s .2s both' }}>
          <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 24, color: T.ink, margin: '0 0 6px' }}>
            ✨ Add New Word
          </h2>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 15, color: T.inkSoft, margin: '0 0 20px' }}>
            Type any English word — we'll auto-translate it to Telugu.
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
              <input
                style={{
                  width: '100%', border: `1.5px solid ${englishInput ? T.orange : T.border}`,
                  borderRadius: 14, padding: '12px 52px 12px 16px',
                  fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.ink, background: T.white, outline: 'none',
                  boxSizing: 'border-box', transition: 'border-color .2s',
                }}
                placeholder="e.g. red flower, black bird…"
                value={englishInput}
                onChange={e => { setEnglishInput(limitToTwoWords(e.target.value)); setPreview(null) }}
                onKeyDown={e => e.key === 'Enter' && handleTranslate()}
                maxLength={40}
              />
              <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: T.sans, fontWeight: 700, fontSize: 12, color: wordCount >= 2 ? '#EF4444' : T.inkSoft }}>
                {wordCount}/2
              </span>
            </div>
            <TVButton onClick={handleTranslate} disabled={translating || !englishInput.trim()}>
              {translating ? '⏳…' : 'Translate →'}
            </TVButton>
          </div>

          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                style={{ marginTop: 16, borderRadius: 18, padding: 20, background: `rgba(58,30,156,0.06)`, border: `1.5px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 18 }}
              >
                <span style={{ fontSize: 36 }}>📝</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <p style={{ fontFamily: T.te, fontSize: 26, fontWeight: 700, color: T.ink, margin: 0 }}>{preview.telugu}</p>
                    <button onClick={() => speakWord(preview.telugu)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: T.ink, color: '#fff', cursor: 'pointer', display: 'grid', placeItems: 'center' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                  </div>
                  <p style={{ fontFamily: T.sans, fontSize: 14, color: T.inkSoft, margin: '4px 0 0' }}>{preview.english} · Translated via Google</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                  <TVButton onClick={handleConfirmAdd} style={{ padding: '9px 16px', fontSize: 13 }}>✅ Add to List</TVButton>
                  <button onClick={() => { setPreview(null); setEnglishInput('') }} style={{ padding: '9px 16px', borderRadius: 999, border: 'none', cursor: 'pointer', fontFamily: T.sans, fontWeight: 800, fontSize: 13, background: '#F1F5F9', color: T.inkSoft }}>
                    ✕ Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TVCard>

        {/* ── Word list ─────────────────────────────────────────────── */}
        <TVCard style={{ overflow: 'hidden', marginTop: 20, animation: 'tvRise .5s .28s both' }}>
          <div style={{ padding: '20px 28px', borderBottom: `1px solid ${T.border}` }}>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink, margin: 0 }}>
              All Words <span style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 700, color: T.inkSoft }}>({words.length})</span>
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 28 }}>⏳</div>
            </div>
          ) : (
            <div>
              {words.map(word => (
                <div key={word.id} style={{ padding: '14px 28px', borderTop: `1px solid ${T.border}` }}>
                  {editId === word.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      {['telugu','english','emoji','hint'].map(field => (
                        <input key={field}
                          style={{ border: `1.5px solid ${T.orange}`, borderRadius: 10, padding: '6px 10px', fontFamily: T.sans, fontSize: 13, color: T.ink, outline: 'none', width: field === 'hint' ? 160 : field === 'telugu' ? 90 : field === 'english' ? 100 : 52 }}
                          value={editForm[field] ?? word[field] ?? ''}
                          onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                          placeholder={field}
                        />
                      ))}
                      <button onClick={() => handleEdit(word.id)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: T.ink, color: '#fff', fontFamily: T.sans, fontWeight: 800, fontSize: 13 }}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: '#F1F5F9', color: T.inkSoft, fontFamily: T.sans, fontWeight: 800, fontSize: 13 }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <span style={{ fontSize: 22, width: 32, textAlign: 'center', flexShrink: 0 }}>{word.emoji}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ fontFamily: T.te, fontSize: 18, fontWeight: 700, color: word.color ?? T.ink }}>{word.telugu}</span>
                        <span style={{ fontFamily: T.sans, fontSize: 13, color: T.inkSoft, fontWeight: 600, marginLeft: 8 }}>{word.english}</span>
                        {word.hint && <p style={{ fontFamily: T.sans, fontSize: 12, color: T.inkSoft, opacity: 0.6, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{word.hint}</p>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => speakWord(word.telugu)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', cursor: 'pointer', background: word.color ?? T.ink, color: '#fff', display: 'grid', placeItems: 'center' }} title="Hear it">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                        </button>
                        <button onClick={() => { setEditId(word.id); setEditForm({ telugu: word.telugu, english: word.english, emoji: word.emoji, hint: word.hint }) }} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: `rgba(58,30,156,0.08)`, color: T.ink, fontFamily: T.sans, fontWeight: 800, fontSize: 13 }}>Edit</button>
                        <button onClick={() => handleDelete(word.id, word.english)} style={{ padding: '6px 14px', borderRadius: 999, border: 'none', cursor: 'pointer', background: '#FEF2F2', color: '#EF4444', fontFamily: T.sans, fontWeight: 800, fontSize: 13 }}>Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </TVCard>
      </TVPage>
      <TVFooter />
    </div>
  )
}
