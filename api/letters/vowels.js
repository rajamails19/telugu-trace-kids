/**
 * api/letters/vowels.js
 * GET /api/letters/vowels → all vowels from DB
 */
import sql from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const rows = await sql`SELECT * FROM letters WHERE category = 'vowel' ORDER BY id`
  res.json(rows)
}
