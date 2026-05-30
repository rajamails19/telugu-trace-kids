/**
 * db.js — SQLite database setup & seeding
 *
 * Uses better-sqlite3 (synchronous, no callbacks needed — great for learning).
 * On first run it:
 *   1. Creates the tables (words + letters)
 *   2. Seeds them from the existing JS data files
 * On subsequent runs it skips seeding (data already there).
 */

import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { words } from '../src/data/words.js'
import { vowels, consonants } from '../src/data/letters.js'
import { shlokas } from '../src/data/shlokas.js'

// __dirname equivalent for ESM (Node.js ESM doesn't have __dirname by default)
const __dirname = dirname(fileURLToPath(import.meta.url))

// SQLite database file lives at server/telugu.sqlite
const db = new Database(join(__dirname, 'telugu.sqlite'))

// ── Create tables ────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS words (
    id      INTEGER PRIMARY KEY,
    telugu  TEXT NOT NULL,
    english TEXT NOT NULL,
    emoji   TEXT,
    hint    TEXT,
    color   TEXT,
    light   TEXT,
    glow    TEXT,
    deco    TEXT   -- stored as JSON string e.g. '["🌊","🐟"]'
  );

  CREATE TABLE IF NOT EXISTS letters (
    id       TEXT PRIMARY KEY,  -- e.g. 'v1', 'c1'
    telugu   TEXT NOT NULL,
    roman    TEXT,
    hint     TEXT,
    category TEXT,              -- 'vowel' or 'consonant'
    color    TEXT,
    light    TEXT,
    glow     TEXT
  );

  CREATE TABLE IF NOT EXISTS progress (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id     INTEGER NOT NULL,        -- references words.id
    stars       INTEGER DEFAULT 1,       -- 1, 2, or 3 stars (mastery level)
    practiced_at TEXT DEFAULT (datetime('now'))  -- ISO timestamp
  );

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
  );
`)

// ── Seed words (only if table is empty) ─────────────────────────────────────
const wordCount = db.prepare('SELECT COUNT(*) as n FROM words').get().n
if (wordCount === 0) {
  const insert = db.prepare(
    'INSERT INTO words (id,telugu,english,emoji,hint,color,light,glow,deco) VALUES (?,?,?,?,?,?,?,?,?)'
  )
  // db.transaction wraps many inserts into one — much faster than inserting one by one
  db.transaction((rows) => {
    for (const w of rows) {
      insert.run(w.id, w.telugu, w.english, w.emoji, w.hint, w.color, w.light, w.glow, JSON.stringify(w.deco ?? []))
    }
  })(words)
  console.log(`[DB] Seeded ${words.length} words`)
}

// ── Seed letters (only if table is empty) ────────────────────────────────────
const letterCount = db.prepare('SELECT COUNT(*) as n FROM letters').get().n
if (letterCount === 0) {
  const insert = db.prepare(
    'INSERT INTO letters (id,telugu,roman,hint,category,color,light,glow) VALUES (?,?,?,?,?,?,?,?)'
  )
  db.transaction((rows) => {
    for (const l of rows) {
      insert.run(l.id, l.telugu, l.roman, l.hint, l.category, l.color, l.light, l.glow)
    }
  })([...vowels, ...consonants])
  console.log(`[DB] Seeded ${vowels.length + consonants.length} letters`)
}

// ── Seed shlokas (only if table is empty) ────────────────────────────────────
const shlokaCount = db.prepare('SELECT COUNT(*) as n FROM shlokas').get().n
if (shlokaCount === 0) {
  const insert = db.prepare(
    'INSERT INTO shlokas (id,name,emoji,telugu,telugu_plain,chant_lines,roman,meaning,color,light,glow) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  )
  db.transaction((rows) => {
    for (const s of rows) {
      insert.run(s.id, s.name, s.emoji, s.telugu, s.telugu_plain ?? s.telugu, JSON.stringify(s.chant_lines ?? []), s.roman, s.meaning, s.color, s.light, s.glow)
    }
  })(shlokas)
  console.log(`[DB] Seeded ${shlokas.length} shlokas`)
}

export default db
