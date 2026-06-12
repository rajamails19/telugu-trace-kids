import { defineConfig } from 'vite'
import react            from '@vitejs/plugin-react'
import tailwindcss      from '@tailwindcss/vite'
import { existsSync, readFileSync } from 'fs'
import { join }  from 'path'
import http      from 'http'

// ── Dynamic backend proxy plugin ──────────────────────────────────────────────
// Reads server/.port (written by server/index.js at startup) so the proxy
// always knows the right port — even if 3001 was taken and the server moved to
// 3002, 3003, etc.  No manual port changes ever needed.
function getBackendPort() {
  const portFile = join(process.cwd(), 'server', '.port')
  if (existsSync(portFile)) return Number(readFileSync(portFile, 'utf8').trim())
  return 3001  // fallback while server is still starting
}

const dynamicBackend = {
  name: 'dynamic-backend-proxy',
  configureServer(viteServer) {
    viteServer.middlewares.use((req, res, next) => {
      // Only intercept /api/* — but leave /api/tts for the static proxy below
      // (it goes to Google, not our local server)
      if (!req.url?.startsWith('/api') || req.url.startsWith('/api/tts')) {
        return next()
      }

      const port = getBackendPort()
      const options = {
        hostname: 'localhost',
        port,
        path: req.url,
        method: req.method,
        headers: { ...req.headers, host: `localhost:${port}`, connection: 'close' },
      }

      const proxy = http.request(options, (backendRes) => {
        res.writeHead(backendRes.statusCode ?? 200, backendRes.headers)
        backendRes.pipe(res)
      })

      proxy.on('error', () => {
        if (!res.headersSent) {
          res.writeHead(503, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Backend not ready yet — please wait a moment.' }))
        }
      })

      req.pipe(proxy)
    })
  },
}
// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [react(), tailwindcss(), dynamicBackend],
  server: {
    port: 5179,
    proxy: {
      // Google TTS — goes to Google's servers, NOT our local backend
      '/api/tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, '/translate_tts'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer':    'https://translate.google.com/',
        },
      },
      // All other /api/* routes are handled by the dynamicBackend plugin above
    },
  },
})
