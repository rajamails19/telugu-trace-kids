// In-memory progress (resets on cold start — for persistent storage upgrade to a DB)
let logs = []
let nextId = 1

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method === 'GET') {
    return res.json(logs)
  }

  if (req.method === 'POST') {
    const { word_id, stars = 1 } = req.body
    const entry = { id: nextId++, word_id, stars, practiced_at: new Date().toISOString() }
    logs.push(entry)
    return res.status(201).json(entry)
  }

  if (req.method === 'DELETE') {
    logs = []
    nextId = 1
    return res.json({ deleted: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
