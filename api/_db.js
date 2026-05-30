/**
 * api/_db.js — Shared Neon PostgreSQL client
 *
 * @neondatabase/serverless uses HTTP instead of TCP, which works
 * inside Vercel serverless functions (no persistent connections needed).
 *
 * Usage in any api/*.js:
 *   import sql from './_db.js'
 *   const rows = await sql`SELECT * FROM words`
 */
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL)

export default sql
