/**
 * routes/letters.js — REST API endpoints for letters
 *
 * GET /api/letters             → all letters (vowels + consonants)
 * GET /api/letters/vowels      → vowels only
 * GET /api/letters/consonants  → consonants only
 */

import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/letters
router.get('/', (_req, res) => {
  const letters = db.prepare('SELECT * FROM letters').all()
  res.json(letters)
})

// GET /api/letters/vowels
router.get('/vowels', (_req, res) => {
  const vowels = db.prepare("SELECT * FROM letters WHERE category = 'vowel'").all()
  res.json(vowels)
})

// GET /api/letters/consonants
router.get('/consonants', (_req, res) => {
  const consonants = db.prepare("SELECT * FROM letters WHERE category = 'consonant'").all()
  res.json(consonants)
})

export default router
