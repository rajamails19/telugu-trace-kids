/**
 * routes/progress.js — REST API for practice progress
 *
 * GET    /api/progress         → all progress records (joined with word data)
 * POST   /api/progress         → log a new practice session  { word_id, stars }
 * PUT    /api/progress/:id     → update stars on an entry    { stars }
 * DELETE /api/progress/:id     → remove one entry
 * DELETE /api/progress         → reset ALL progress
 */

import { Router } from 'express'
import db from '../db.js'

const router = Router()

// ── GET all progress (join with words so frontend gets telugu + english too) ──
router.get('/', (_req, res) => {
  const rows = db.prepare(`
    SELECT p.id, p.word_id, p.stars, p.practiced_at,
           w.telugu, w.english, w.emoji, w.color, w.light, w.glow
    FROM   progress p
    JOIN   words w ON w.id = p.word_id
    ORDER  BY p.practiced_at DESC
  `).all()
  res.json(rows)
})

// ── POST — log a new practice session ────────────────────────────────────────
router.post('/', (req, res) => {
  const { word_id, stars = 1 } = req.body
  if (!word_id) return res.status(400).json({ error: 'word_id is required' })

  const result = db.prepare(
    'INSERT INTO progress (word_id, stars) VALUES (?, ?)'
  ).run(word_id, stars)

  res.status(201).json({ id: result.lastInsertRowid, word_id, stars })
})

// ── PUT — update stars for an existing entry ─────────────────────────────────
router.put('/:id', (req, res) => {
  const { stars } = req.body
  if (!stars) return res.status(400).json({ error: 'stars is required' })

  const result = db.prepare(
    'UPDATE progress SET stars = ? WHERE id = ?'
  ).run(stars, Number(req.params.id))

  if (result.changes === 0) return res.status(404).json({ error: 'Entry not found' })
  res.json({ id: Number(req.params.id), stars })
})

// ── DELETE one entry ──────────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const result = db.prepare('DELETE FROM progress WHERE id = ?').run(Number(req.params.id))
  if (result.changes === 0) return res.status(404).json({ error: 'Entry not found' })
  res.json({ deleted: true })
})

// ── DELETE all (reset) — must come BEFORE /:id or router matches 'all' as id ─
router.delete('/', (_req, res) => {
  db.prepare('DELETE FROM progress').run()
  res.json({ reset: true })
})

export default router
