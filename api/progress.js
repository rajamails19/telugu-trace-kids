/**
 * api/progress.js
 * GET    /api/progress  → all progress logs (joined with word info)
 * POST   /api/progress  → log a practice session
 * DELETE /api/progress  → reset ALL progress
 */
import sql from './_db.js'

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT p.id, p.word_id, p.stars, p.practiced_at,
             w.telugu, w.english, w.emoji, w.color
      FROM progress p
      JOIN words w ON p.word_id = w.id
      ORDER BY p.practiced_at DESC`
    return res.json(rows)
  }

  if (req.method === 'POST') {
    const { word_id, stars = 1 } = req.body
    const [row] = await sql`
      INSERT INTO progress (word_id, stars)
      VALUES (${word_id}, ${stars})
      RETURNING *`
    return res.status(201).json(row)
  }

  if (req.method === 'DELETE') {
    await sql`DELETE FROM progress`
    return res.json({ deleted: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
