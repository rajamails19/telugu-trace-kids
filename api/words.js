/**
 * api/words.js
 * GET  /api/words        → all words
 * POST /api/words        → create new word
 */
import sql from './_db.js'

const cors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

const parseWord = (r) => ({ ...r, deco: JSON.parse(r.deco ?? '[]') })

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    const rows = await sql`SELECT * FROM words ORDER BY id`
    return res.json(rows.map(parseWord))
  }

  if (req.method === 'POST') {
    const { telugu, english, emoji, hint, color, light, glow, deco } = req.body
    const [{ max }] = await sql`SELECT COALESCE(MAX(id), 0) as max FROM words`
    const id = Number(max) + 1
    await sql`
      INSERT INTO words (id, telugu, english, emoji, hint, color, light, glow, deco)
      VALUES (${id}, ${telugu}, ${english}, ${emoji ?? null}, ${hint ?? null},
              ${color ?? '#EA580C'}, ${light ?? '#FFF7ED'}, ${glow ?? '#FB923C'},
              ${JSON.stringify(deco ?? [])})`
    const [row] = await sql`SELECT * FROM words WHERE id = ${id}`
    return res.status(201).json(parseWord(row))
  }

  res.status(405).json({ error: 'Method not allowed' })
}
