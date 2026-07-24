/**
 * api/letters/consonants.js
 * GET /api/letters/consonants → all consonants from DB
 */
import sql from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const rows = await sql`SELECT * FROM letters WHERE category = 'consonant' ORDER BY id`
    res.json(rows)
  } catch (err) {
    console.error('[api/letters/consonants]', err)
    res.status(500).json({ error: err.message })
  }
}
