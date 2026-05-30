/**
 * api/shlokas.js
 * GET /api/shlokas → all shlokas from DB
 */
import sql from './_db.js'

const parseRow = (r) => ({ ...r, chant_lines: JSON.parse(r.chant_lines ?? '[]') })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const rows = await sql`SELECT * FROM shlokas ORDER BY id`
  res.json(rows.map(parseRow))
}
