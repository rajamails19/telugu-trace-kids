/**
 * routes/shlokas.js
 *
 * GET /api/shlokas      → all 14 shlokas
 * GET /api/shlokas/:id  → single shloka by id
 */

import { Router } from 'express'
import db from '../db.js'

const router = Router()

// chant_lines is stored as a JSON string in SQLite — parse it back into an array
const parseRow = (row) => ({ ...row, chant_lines: JSON.parse(row.chant_lines ?? '[]') })

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT * FROM shlokas ORDER BY id').all()
  res.json(rows.map(parseRow))
})

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM shlokas WHERE id = ?').get(Number(req.params.id))
  if (!row) return res.status(404).json({ error: 'Shloka not found' })
  res.json(parseRow(row))
})

export default router
