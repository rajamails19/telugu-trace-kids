/**
 * routes/translate.js — Backend proxy for Google Translate (English → Telugu)
 *
 * Why a backend proxy?
 *   Calling Google Translate from the browser fails (CORS).
 *   Calling it from Node.js (server-to-server) works fine.
 *
 * GET /api/translate?q=hello
 *   → fetches Google Translate on server side
 *   → returns { translated: "హలో", original: "hello" }
 */

import { Router } from 'express'

const router = Router()

// Telugu Unicode range: U+0C00–U+0C7F
// Used to validate that the translation is actually Telugu script
function isTeluguScript(text) {
  return /[ఀ-౿]/.test(text)
}

router.get('/', async (req, res) => {
  const { q } = req.query
  if (!q || !q.trim()) return res.status(400).json({ error: 'q param is required' })

  try {
    // Google Translate unofficial free endpoint — no API key needed
    // tl=te → target language Telugu
    // sl=en → source language English
    // dt=t  → return translation text
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(q.trim())}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) throw new Error(`Google returned HTTP ${response.status}`)

    // Response shape: [ [ ["translatedChunk","originalChunk",...], ... ], null, "en", ... ]
    // data[0] is an array of chunks — join them all for multi-word phrases
    const data = await response.json()
    const translated = data[0]?.map(chunk => chunk[0]).filter(Boolean).join('') ?? ''

    if (!translated) throw new Error('Got empty translation')

    // Validate it's actual Telugu script, not romanized/English fallback
    if (!isTeluguScript(translated)) {
      return res.status(422).json({
        error: 'No Telugu script found in translation',
        got: translated,
      })
    }

    console.log(`[Translate] "${q.trim()}" → "${translated}"`)
    res.json({ translated, original: q.trim() })

  } catch (err) {
    console.error('[Translate] Error:', err.message)
    res.status(502).json({ error: 'Translation failed', detail: err.message })
  }
})

export default router
