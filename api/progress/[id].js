/**
 * api/progress/[id].js
 * PUT    /api/progress/:id  → update stars for a log entry
 * DELETE /api/progress/:id  → delete one log entry
 */
import sql from '../_db.js'

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const id = Number(req.query.id)

  if (req.method === 'PUT') {
    const { stars } = req.body
    const result = await sql`
      UPDATE progress SET stars = ${stars} WHERE id = ${id} RETURNING *`
    if (!result.length) return res.status(404).json({ error: 'Progress entry not found' })
    return res.json(result[0])
  }

  if (req.method === 'DELETE') {
    const result = await sql`DELETE FROM progress WHERE id = ${id} RETURNING id`
    if (!result.length) return res.status(404).json({ error: 'Progress entry not found' })
    return res.json({ deleted: id })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
