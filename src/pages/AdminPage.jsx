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
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { speakWord } from '../hooks/useSpeech'

const ACCENT = '#6366F1'
const LIGHT  = '#EEF2FF'

// ── Helper: call our backend proxy → Google Translate (English → Telugu) ──────
// We proxy through our Express server to avoid CORS issues with Google's API
async function translateToTelugu(english) {
  const res  = await fetch(`/api/translate?q=${encodeURIComponent(english)}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? 'Translation failed')
  return data.translated
}

// ── Helper: enforce max 2 words ───────────────────────────────────────────────
function limitToTwoWords(value) {
  const words = value.trimStart().split(/\s+/)
  // allow typing the 2nd word freely; block a 3rd space
  if (words.length > 2) return words.slice(0, 2).join(' ')
  return value
}

export default function AdminPage() {
  const [words,       setWords]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [editId,      setEditId]      = useState(null)
  const [editForm,    setEditForm]    = useState({})
  const [refresh,     setRefresh]     = useState(0)
  const [toast,       setToast]       = useState(null)

  // ── Add-word state ───────────────────────────────────────────────────────────
  const [englishInput, setEnglishInput] = useState('')
  const [translating,  setTranslating]  = useState(false)
  const [preview,      setPreview]      = useState(null)  // { telugu, english } after translation

  // ── Fetch words ──────────────────────────────────────────────────────────────
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

  // ── Step 1: Translate English → Telugu ───────────────────────────────────────
  const handleTranslate = async () => {
    const eng = englishInput.trim()
    if (!eng) return showToast('Type a word first', false)
    setTranslating(true)
    setPreview(null)
    try {
      const telugu = await translateToTelugu(eng)
      setPreview({ telugu, english: eng })
    } catch {
      showToast('❌ Translation failed — check your internet', false)
    } finally {
      setTranslating(false)
    }
  }

  // ── Step 2: POST confirmed word to our backend ────────────────────────────────
  const handleConfirmAdd = async () => {
    if (!preview) return
    const res = await fetch('/api/words', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        telugu:  preview.telugu,
        english: preview.english,
        emoji:   '📝',
        hint:    `The word for ${preview.english}`,
      }),
    })
    if (res.ok) {
      setEnglishInput('')
      setPreview(null)
      setRefresh(r => r + 1)
      showToast(`✅ "${preview.english}" added!`)
    } else {
      showToast('❌ Failed to save', false)
    }
  }

  // ── PUT: save edit ────────────────────────────────────────────────────────────
  const handleEdit = async (id) => {
    const res = await fetch(`/api/words/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(editForm),
    })
    if (res.ok) {
      setEditId(null)
      setRefresh(r => r + 1)
      showToast('✅ Word updated!')
    } else {
      showToast('❌ Failed to update', false)
    }
  }

  // ── DELETE ────────────────────────────────────────────────────────────────────
  const handleDelete = async (id, english) => {
    if (!window.confirm(`Delete "${english}"?`)) return
    const res = await fetch(`/api/words/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setRefresh(r => r + 1)
      showToast(`🗑️ "${english}" deleted`)
    } else {
      showToast('❌ Failed to delete', false)
    }
  }

  const wordCount = englishInput.trim() === '' ? 0 : englishInput.trim().split(/\s+/).length

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
        <div>
          <h1 className="text-2xl font-black" style={{ color: ACCENT }}>⚙️ Word Manager</h1>
          <p className="text-sm font-semibold text-slate-400 mt-0.5">Type any English word — we'll auto-translate it to Telugu</p>
        </div>

        {/* ── Add word card ─────────────────────────────────────────────────────── */}
        <div
          className="bg-white rounded-3xl p-5 flex flex-col gap-4"
          style={{ boxShadow: `0 8px 30px ${ACCENT}18`, border: `1.5px solid ${ACCENT}20` }}
        >
          <p className="text-xs font-extrabold uppercase tracking-widest" style={{ color: ACCENT }}>+ Add New Word</p>

          {/* Step 1 — English input */}
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <input
                className="w-full border-2 rounded-xl px-4 py-3 text-base font-semibold outline-none transition-all"
                style={{
                  borderColor: englishInput ? ACCENT : '#E2E8F0',
                  color: '#1E293B',
                }}
                placeholder="Type a word… e.g. black, red flower"
                value={englishInput}
                onChange={e => {
                  setEnglishInput(limitToTwoWords(e.target.value))
                  setPreview(null)   // clear preview if user changes the word
                }}
                onKeyDown={e => e.key === 'Enter' && handleTranslate()}
                maxLength={40}
              />
              {/* word count badge */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ color: wordCount >= 2 ? '#EF4444' : '#CBD5E1' }}
              >
                {wordCount}/2 words
              </span>
            </div>

            <motion.button
              onClick={handleTranslate}
              disabled={translating || !englishInput.trim()}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 rounded-xl text-sm font-extrabold text-white shrink-0 transition-all"
              style={{
                background: (!translating && englishInput.trim()) ? ACCENT : '#CBD5E1',
                boxShadow: (!translating && englishInput.trim()) ? `0 4px 14px ${ACCENT}55` : 'none',
              }}
            >
              {translating ? '⏳ …' : 'Translate →'}
            </motion.button>
          </div>

          {/* Step 2 — Preview card (appears after translation) */}
          <AnimatePresence>
            {preview && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-4 flex items-center gap-4"
                style={{ background: `${ACCENT}10`, border: `2px solid ${ACCENT}30` }}
              >
                <span className="text-4xl">📝</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="telugu text-2xl font-black" style={{ color: ACCENT }}>{preview.telugu}</p>
                    <motion.button
                      onClick={() => speakWord(preview.telugu)}
                      whileTap={{ scale: 0.88 }}
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: ACCENT, color: 'white', boxShadow: `0 3px 10px ${ACCENT}66` }}
                      title="Hear it"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </motion.button>
                  </div>
                  <p className="text-sm font-semibold text-slate-400">{preview.english}</p>
                  <p className="text-xs text-slate-300 mt-0.5">Translated via Google · You can edit after adding</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <motion.button
                    onClick={handleConfirmAdd}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold text-white"
                    style={{ background: ACCENT }}
                  >
                    ✅ Add to List
                  </motion.button>
                  <button
                    onClick={() => { setPreview(null); setEnglishInput('') }}
                    className="px-4 py-2 rounded-full text-xs font-extrabold text-slate-400 bg-slate-100"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Word list ─────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 4px 20px #00000010' }}>
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              All Words ({words.length})
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="text-2xl animate-bounce">⏳</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {words.map((word) => (
                <div key={word.id} className="px-5 py-3">
                  {editId === word.id ? (
                    /* ── Inline edit row (PUT) ── */
                    <div className="flex gap-2 items-center flex-wrap">
                      <input
                        className="border-2 rounded-lg px-2 py-1 text-sm w-24 outline-none"
                        style={{ borderColor: ACCENT }}
                        value={editForm.telugu ?? word.telugu}
                        onChange={e => setEditForm(f => ({ ...f, telugu: e.target.value }))}
                      />
                      <input
                        className="border-2 rounded-lg px-2 py-1 text-sm w-28 outline-none"
                        style={{ borderColor: ACCENT }}
                        value={editForm.english ?? word.english}
                        onChange={e => setEditForm(f => ({ ...f, english: e.target.value }))}
                      />
                      <input
                        className="border-2 rounded-lg px-2 py-1 text-sm w-14 outline-none"
                        style={{ borderColor: ACCENT }}
                        value={editForm.emoji ?? word.emoji}
                        onChange={e => setEditForm(f => ({ ...f, emoji: e.target.value }))}
                      />
                      <input
                        className="border-2 rounded-lg px-2 py-1 text-sm flex-1 outline-none"
                        style={{ borderColor: ACCENT }}
                        value={editForm.hint ?? word.hint}
                        onChange={e => setEditForm(f => ({ ...f, hint: e.target.value }))}
                      />
                      <button
                        onClick={() => handleEdit(word.id)}
                        className="px-3 py-1 rounded-full text-xs font-extrabold text-white"
                        style={{ background: ACCENT }}
                      >Save</button>
                      <button
                        onClick={() => setEditId(null)}
                        className="px-3 py-1 rounded-full text-xs font-extrabold text-slate-400 bg-slate-100"
                      >Cancel</button>
                    </div>
                  ) : (
                    /* ── Normal row ── */
                    <div className="flex items-center gap-3">
                      <span className="text-xl w-8 text-center">{word.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="telugu text-base font-extrabold" style={{ color: word.color }}>{word.telugu}</span>
                        <span className="text-xs text-slate-400 font-semibold ml-2">{word.english}</span>
                        {word.hint && <p className="text-xs text-slate-300 truncate">{word.hint}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Play / hear button */}
                        <motion.button
                          onClick={() => speakWord(word.telugu)}
                          whileTap={{ scale: 0.88 }}
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ background: word.color ?? ACCENT, color: 'white', boxShadow: `0 3px 10px ${word.glow ?? ACCENT}66` }}
                          title="Hear it"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </motion.button>
                        <button
                          onClick={() => { setEditId(word.id); setEditForm({ telugu: word.telugu, english: word.english, emoji: word.emoji, hint: word.hint }) }}
                          className="px-3 py-1 rounded-full text-xs font-extrabold"
                          style={{ background: `${ACCENT}15`, color: ACCENT }}
                        >Edit</button>
                        <button
                          onClick={() => handleDelete(word.id, word.english)}
                          className="px-3 py-1 rounded-full text-xs font-extrabold"
                          style={{ background: '#FEF2F2', color: '#EF4444' }}
                        >Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
