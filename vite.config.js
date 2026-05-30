import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5179,
    proxy: {
      // ── Google TTS (audio) ──────────────────────────────────────────────
      '/api/tts': {
        target: 'https://translate.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tts/, '/translate_tts'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      },
      // ── Backend API (words + letters from SQLite) ───────────────────────
      // Vite forwards these to our Express server on port 3001
      '/api/words':     { target: 'http://localhost:3001', changeOrigin: true },
      '/api/letters':   { target: 'http://localhost:3001', changeOrigin: true },
      '/api/progress':  { target: 'http://localhost:3001', changeOrigin: true },
      '/api/translate': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/shlokas':    { target: 'http://localhost:3001', changeOrigin: true },
      '/api/shloka-tts': { target: 'http://localhost:3001', changeOrigin: true },
      '/api/health':     { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
