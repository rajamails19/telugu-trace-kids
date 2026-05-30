/**
 * server/index.js — Express backend entry point
 *
 * Starts an HTTP server on port 3001.
 * The Vite dev server (port 5179) proxies /api/* requests here.
 */

// ── Inline .env loader (no dotenv dependency) ─────────────────────────────────
// Reads .env from the project root, sets process.env for each KEY=VALUE line.
// Only sets keys that aren't already present (env vars set by the OS take priority).
import { readFileSync, existsSync } from 'fs'
import { fileURLToPath }            from 'url'
import { dirname, join }            from 'path'
const __serverDir = dirname(fileURLToPath(import.meta.url))
const envPath     = join(__serverDir, '..', '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq  = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = val
  }
  console.log('[Server] .env loaded')
}
// ─────────────────────────────────────────────────────────────────────────────

import express      from 'express'
import cors         from 'cors'
import wordsRouter     from './routes/words.js'
import lettersRouter   from './routes/letters.js'
import progressRouter  from './routes/progress.js'
import translateRouter from './routes/translate.js'
import shlokasRouter   from './routes/shlokas.js'
import shlokaTtsRouter from './routes/shloka-tts.js'
import './db.js'   // runs DB setup + seeding on startup

const app  = express()
const PORT = 3001

app.use(cors())           // allow requests from Vite dev server
app.use(express.json())   // parse JSON request bodies

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/words',      wordsRouter)
app.use('/api/letters',    lettersRouter)
app.use('/api/progress',   progressRouter)
app.use('/api/translate',  translateRouter)
app.use('/api/shlokas',    shlokasRouter)
app.use('/api/shloka-tts', shlokaTtsRouter)

// Health-check — useful to verify the server is alive
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`[Server] Running at http://localhost:${PORT}`)
  console.log(`[Server] Try: http://localhost:${PORT}/api/words`)
})
