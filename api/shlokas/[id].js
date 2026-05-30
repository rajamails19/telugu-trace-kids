/**
 * api/shlokas/[id].js
 * GET /api/shlokas/:id → single shloka
 */
import sql from '../_db.js'

const parseRow = (r) => ({ ...r, chant_lines: JSON.parse(r.chant_lines ?? '[]') })

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const id = Number(req.query.id)
  const [row] = await sql`SELECT * FROM shlokas WHERE id = ${id}`
  if (!row) return res.status(404).json({ error: 'Shloka not found' })
  res.json(parseRow(row))
}
