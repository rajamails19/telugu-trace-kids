/**
 * routes/words.js — REST API endpoints for words
 *
 * GET    /api/words        → all words
 * GET    /api/words/:id    → single word by id
 * POST   /api/words        → create a new word
 * PUT    /api/words/:id    → update a word
 * DELETE /api/words/:id    → delete a word
 */

import { Router } from 'express'
import db from '../db.js'

const router = Router()

// ── GET all words ─────────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM words ORDER BY id').all()
  const words = rows.map(w => ({ ...w, deco: JSON.parse(w.deco ?? '[]') }))
  res.json(words)
})

// ── GET single word ───────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM words WHERE id = ?').get(Number(req.params.id))
  if (!row) return res.status(404).json({ error: 'Word not found' })
  res.json({ ...row, deco: JSON.parse(row.deco ?? '[]') })
})

// ── POST — create a new word ──────────────────────────────────────────────────
router.post('/', (req, res) => {
  const { telugu, english, emoji = '📝', hint = '', color = '#6366F1', light = '#EEF2FF', glow = '#818CF8' } = req.body
  if (!telugu || !english) return res.status(400).json({ error: 'telugu and english are required' })

  // Auto-assign next id (max existing id + 1)
  const { maxId } = db.prepare('SELECT MAX(id) as maxId FROM words').get()
  const newId = (maxId ?? 0) + 1

  db.prepare(
    'INSERT INTO words (id,telugu,english,emoji,hint,color,light,glow,deco) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(newId, telugu, english, emoji, hint, color, light, glow, '[]')

  res.status(201).json({ id: newId, telugu, english, emoji, hint, color, light, glow, deco: [] })
})

// ── PUT — update a word ───────────────────────────────────────────────────────
router.put('/:id', (req, res) => {
  const { telugu, english, emoji, hint } = req.body
  const id = Number(req.params.id)

  const existing = db.prepare('SELECT * FROM words WHERE id = ?').get(id)
  if (!existing) return res.status(404).json({ error: 'Word not found' })

  db.prepare(
    'UPDATE words SET telugu=?, english=?, emoji=?, hint=? WHERE id=?'
  ).run(
    telugu  ?? existing.telugu,
    english ?? existing.english,
    emoji   ?? existing.emoji,
    hint    ?? existing.hint,
    id
  )

  res.json({ id, telugu, english, emoji, hint })
})

// ── DELETE — remove a word ────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM words WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Word not found' })
  res.json({ deleted: true })
})

export default router
