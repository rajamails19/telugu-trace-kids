/**
 * api/translate.js
 * GET /api/translate?q=word → English to Telugu via Google Translate
 *
 * Calling from the server avoids CORS. Validates that the result is
 * actual Telugu script (not romanized fallback).
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const q = req.query.q
  if (!q) return res.status(400).json({ error: 'Missing ?q= parameter' })

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(q)}`
  const response = await fetch(url)
  const data = await response.json()
  const translated = data[0]?.[0]?.[0] ?? q

  if (!/[ఀ-౿]/.test(translated)) {
    return res.status(422).json({ error: 'Translation did not return Telugu script', raw: translated })
  }

  res.json({ translated, original: q })
}
