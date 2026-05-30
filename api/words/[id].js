/**
 * api/words/[id].js
 * PUT    /api/words/:id  → update a word
 * DELETE /api/words/:id  → delete a word
 */
import sql from '../_db.js'

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const parseWord = (r) => ({ ...r, deco: JSON.parse(r.deco ?? '[]') })

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  const id = Number(req.query.id)

  if (req.method === 'PUT') {
    const [existing] = await sql`SELECT * FROM words WHERE id = ${id}`
    if (!existing) return res.status(404).json({ error: 'Word not found' })
    const b = req.body
    await sql`
      UPDATE words SET
        telugu  = ${b.telugu  ?? existing.telugu},
        english = ${b.english ?? existing.english},
        emoji   = ${b.emoji   ?? existing.emoji},
        hint    = ${b.hint    ?? existing.hint},
        color   = ${b.color   ?? existing.color},
        light   = ${b.light   ?? existing.light},
        glow    = ${b.glow    ?? existing.glow},
        deco    = ${b.deco ? JSON.stringify(b.deco) : existing.deco}
      WHERE id = ${id}`
    const [row] = await sql`SELECT * FROM words WHERE id = ${id}`
    return res.json(parseWord(row))
  }

  if (req.method === 'DELETE') {
    const result = await sql`DELETE FROM words WHERE id = ${id} RETURNING id`
    if (!result.length) return res.status(404).json({ error: 'Word not found' })
    return res.json({ deleted: id })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
