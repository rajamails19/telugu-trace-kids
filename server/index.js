/**
 * server/index.js — Express backend entry point
 *
 * Auto-finds a free port starting from 3001.
 * Writes the chosen port to server/.port so Vite's proxy can read it.
 * The Vite dev server proxies /api/* requests here automatically.
 */

// ── Inline .env loader ────────────────────────────────────────────────────────
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join }  from 'path'
import net                from 'net'

const __serverDir = dirname(fileURLToPath(import.meta.url))
const envPath     = join(__serverDir, '..', '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq  = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    const val = t.slice(eq + 1).trim()
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
import './db.js'

// ── Auto-find a free port ─────────────────────────────────────────────────────
// Tries 3001, 3002, 3003 … until it finds one that isn't in use.
function findFreePort(start) {
  return new Promise((resolve) => {
    const srv = net.createServer()
    srv.once('error', () => resolve(findFreePort(start + 1)))
    srv.once('listening', () => srv.close(() => resolve(start)))
    srv.listen(start)
  })
}

const PORT     = await findFreePort(3001)
const portFile = join(__serverDir, '.port')

// Write port to file so vite.config.js can read it for dynamic proxying
writeFileSync(portFile, String(PORT))

// Clean up the port file when the server stops
process.on('exit',    () => { try { unlinkSync(portFile) } catch {} })
process.on('SIGINT',  () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))
// ─────────────────────────────────────────────────────────────────────────────

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/words',      wordsRouter)
app.use('/api/letters',    lettersRouter)
app.use('/api/progress',   progressRouter)
app.use('/api/translate',  translateRouter)
app.use('/api/shlokas',    shlokasRouter)
app.use('/api/shloka-tts', shlokaTtsRouter)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`[Server] Running at http://localhost:${PORT}`)
  console.log(`[Server] Try: http://localhost:${PORT}/api/words`)
})
