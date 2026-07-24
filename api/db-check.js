/**
 * api/db-check.js — Diagnostic endpoint
 * GET /api/db-check → shows DATABASE_URL status + Neon ping result
 * Remove this file once the issue is resolved.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const url = process.env.DATABASE_URL
  if (!url) {
    return res.status(500).json({ ok: false, error: 'DATABASE_URL is not set in Vercel environment variables' })
  }

  // Mask password for safe display
  const masked = url.replace(/:([^@]+)@/, ':***@')

  try {
    const { neon } = await import('@neondatabase/serverless')
    const sql = neon(url)
    const [{ now }] = await sql`SELECT NOW() as now`
    return res.json({ ok: true, db_time: now, url: masked })
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message, url: masked })
  }
}
