/**
 * scripts/seed-neon.js — One-time setup for the Neon PostgreSQL database
 *
 * Run once:  node scripts/seed-neon.js
 *
 * What it does:
 *   1. Creates the 4 tables (words, letters, progress, shlokas) if they don't exist
 *   2. Seeds words, letters, and shlokas from the JS data files
 *   3. Skips seeding if data is already there (safe to re-run)
 */

// ── Load .env ────────────────────────────────────────────────────────────────
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
const __dir = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dir, '..', '.env')
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const k = t.slice(0, eq).trim()
    const v = t.slice(eq + 1).trim()
    if (k && !(k in process.env)) process.env[k] = v
  }
}
// ─────────────────────────────────────────────────────────────────────────────

import { neon } from '@neondatabase/serverless'
import { words }              from '../src/data/words.js'
import { vowels, consonants } from '../src/data/letters.js'
import { shlokas }            from '../src/data/shlokas.js'

const sql = neon(process.env.DATABASE_URL)

console.log('🔌 Connecting to Neon…')

// ── Create tables ─────────────────────────────────────────────────────────────
await sql`
  CREATE TABLE IF NOT EXISTS words (
    id      INTEGER PRIMARY KEY,
    telugu  TEXT NOT NULL,
    english TEXT NOT NULL,
    emoji   TEXT,
    hint    TEXT,
    color   TEXT,
    light   TEXT,
    glow    TEXT,
    deco    TEXT
  )`

await sql`
  CREATE TABLE IF NOT EXISTS letters (
    id       TEXT PRIMARY KEY,
    telugu   TEXT NOT NULL,
    roman    TEXT,
    hint     TEXT,
    category TEXT,
    color    TEXT,
    light    TEXT,
    glow     TEXT
  )`

await sql`
  CREATE TABLE IF NOT EXISTS progress (
    id           SERIAL PRIMARY KEY,
    word_id      INTEGER NOT NULL,
    stars        INTEGER DEFAULT 1,
    practiced_at TIMESTAMPTZ DEFAULT NOW()
  )`

await sql`
  CREATE TABLE IF NOT EXISTS shlokas (
    id            INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    emoji         TEXT,
    telugu        TEXT NOT NULL,
    telugu_plain  TEXT,
    chant_lines   TEXT,
    roman         TEXT,
    meaning       TEXT,
    color         TEXT,
    light         TEXT,
    glow          TEXT
  )`

console.log('✅ Tables ready')

// ── Seed words ────────────────────────────────────────────────────────────────
const [{ count: wCount }] = await sql`SELECT COUNT(*)::int as count FROM words`
if (wCount === 0) {
  for (const w of words) {
    await sql`
      INSERT INTO words (id, telugu, english, emoji, hint, color, light, glow, deco)
      VALUES (${w.id}, ${w.telugu}, ${w.english}, ${w.emoji ?? null}, ${w.hint ?? null},
              ${w.color ?? null}, ${w.light ?? null}, ${w.glow ?? null},
              ${JSON.stringify(w.deco ?? [])})`
  }
  console.log(`✅ Seeded ${words.length} words`)
} else {
  console.log(`⏭  Words already seeded (${wCount} rows)`)
}

// ── Seed letters ──────────────────────────────────────────────────────────────
const [{ count: lCount }] = await sql`SELECT COUNT(*)::int as count FROM letters`
if (lCount === 0) {
  const allLetters = [...vowels, ...consonants]
  for (const l of allLetters) {
    await sql`
      INSERT INTO letters (id, telugu, roman, hint, category, color, light, glow)
      VALUES (${l.id}, ${l.telugu}, ${l.roman ?? null}, ${l.hint ?? null},
              ${l.category}, ${l.color ?? null}, ${l.light ?? null}, ${l.glow ?? null})`
  }
  console.log(`✅ Seeded ${allLetters.length} letters`)
} else {
  console.log(`⏭  Letters already seeded (${lCount} rows)`)
}

// ── Seed shlokas ──────────────────────────────────────────────────────────────
const [{ count: sCount }] = await sql`SELECT COUNT(*)::int as count FROM shlokas`
if (sCount === 0) {
  for (const s of shlokas) {
    await sql`
      INSERT INTO shlokas (id, name, emoji, telugu, telugu_plain, chant_lines, roman, meaning, color, light, glow)
      VALUES (${s.id}, ${s.name}, ${s.emoji ?? null}, ${s.telugu},
              ${s.telugu_plain ?? s.telugu}, ${JSON.stringify(s.chant_lines ?? [])},
              ${s.roman ?? null}, ${s.meaning ?? null},
              ${s.color ?? null}, ${s.light ?? null}, ${s.glow ?? null})`
  }
  console.log(`✅ Seeded ${shlokas.length} shlokas`)
} else {
  console.log(`⏭  Shlokas already seeded (${sCount} rows)`)
}

console.log('\n🎉 Neon database is ready!')
