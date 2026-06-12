/**
 * api/tts.js — Google TTS proxy for Vercel
 *
 * Forwards /api/tts?... to Google Translate TTS on the server side.
 * This avoids CORS issues that happen when the browser calls Google directly.
 *
 * Locally: Vite's dev proxy handles this (vite.config.js)
 * Vercel:  This serverless function handles it
 */
export default async function handler(req, res) {
  // Forward all query params to Google as-is
  const params = new URLSearchParams(req.query).toString()
  const url    = `https://translate.google.com/translate_tts?${params}`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer':    'https://translate.google.com/',
    },
  })

  if (!response.ok) {
    return res.status(response.status).end()
  }

  // Forward the audio response back to the browser
  const buffer = await response.arrayBuffer()
  res.setHeader('Content-Type', response.headers.get('Content-Type') ?? 'audio/mpeg')
  res.setHeader('Cache-Control', 'public, max-age=86400')  // cache audio for 1 day
  res.send(Buffer.from(buffer))
}
