/**
 * shloka-tts.js — Sarvam AI text-to-speech proxy with disk cache
 *
 * POST /api/shloka-tts
 *   body: { text, shloka_id, line_index }
 *   returns: { audio: "<base64 WAV string>" }
 *
 * Cache lives at  server/cache/shloka-audio/shloka_<id>_line_<n>.b64
 * On cache hit  → reads file, returns base64 instantly (no API call)
 * On cache miss → calls Sarvam AI, saves base64, returns it
 *
 * Frontend creates:  new Audio(`data:audio/wav;base64,${audio}`)
 */

import { Router }                                              from 'express'
import { existsSync, mkdirSync, readFileSync, writeFileSync }  from 'fs'
import { join, dirname }                                       from 'path'
import { fileURLToPath }                                       from 'url'

const router     = Router()
const __dirname  = dirname(fileURLToPath(import.meta.url))
const CACHE_DIR  = join(__dirname, '..', 'cache', 'shloka-audio')

// Ensure cache directory exists on startup
if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true })

router.post('/', async (req, res) => {
  const { text, shloka_id, line_index } = req.body

  if (!text || shloka_id == null || line_index == null) {
    return res.status(400).json({ error: 'Missing required fields: text, shloka_id, line_index' })
  }

  // ── Cache check ─────────────────────────────────────────────────────────────
  const cacheFile = join(CACHE_DIR, `shloka_${shloka_id}_line_${line_index}.b64`)
  if (existsSync(cacheFile)) {
    console.log(`[shloka-tts] cache hit  shloka=${shloka_id} line=${line_index}`)
    const audio = readFileSync(cacheFile, 'utf8')
    return res.json({ audio })
  }

  // ── Sarvam AI call ──────────────────────────────────────────────────────────
  const apiKey = process.env.SARVAM_API_KEY
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    console.warn('[shloka-tts] SARVAM_API_KEY not set — cannot call API')
    return res.status(503).json({
      error: 'SARVAM_API_KEY is not configured. Add it to your .env file.',
    })
  }

  console.log(`[shloka-tts] calling Sarvam AI  shloka=${shloka_id} line=${line_index}: "${text}"`)

  try {
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        inputs:                [text],
        target_language_code:  'te-IN',
        speaker:               'roopa',     // warm female temple voice
        pace:                  0.75,        // 25% slower — clear for kids
        model:                 'bulbul:v3', // Sarvam's best Indic model
        enable_preprocessing:  false,       // send Telugu script as-is
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`[shloka-tts] Sarvam API error ${response.status}:`, errText)
      return res.status(response.status).json({ error: `Sarvam API error: ${errText}` })
    }

    const data  = await response.json()
    const audio = data.audios?.[0]

    if (!audio) {
      console.error('[shloka-tts] Sarvam returned no audio in response')
      return res.status(500).json({ error: 'Sarvam returned no audio' })
    }

    // ── Save to cache ─────────────────────────────────────────────────────────
    writeFileSync(cacheFile, audio, 'utf8')
    console.log(`[shloka-tts] cached → ${cacheFile}`)

    return res.json({ audio })
  } catch (err) {
    console.error('[shloka-tts] fetch error:', err)
    return res.status(500).json({ error: err.message })
  }
})

export default router
