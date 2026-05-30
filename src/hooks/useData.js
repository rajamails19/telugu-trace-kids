/**
 * useData.js — React hooks for fetching words & letters from the backend API
 *
 * Instead of importing hardcoded JS arrays, the UI now fetches
 * from Express → SQLite over HTTP. This is the fullstack pattern.
 *
 * useWords()   → { words, loading, error }
 * useLetters() → { vowels, consonants, loading, error }
 */

import { useState, useEffect } from 'react'

export function useWords() {
  const [words,   setWords]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetch('/api/words')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setWords(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[useWords] fetch failed:', err.message)
        setError(err.message)
        setLoading(false)
      })
  }, [])   // empty [] = run once when the component first mounts

  return { words, loading, error }
}

export function useLetters() {
  const [vowels,     setVowels]     = useState([])
  const [consonants, setConsonants] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    // Promise.all fires both requests at the same time (parallel, faster)
    Promise.all([
      fetch('/api/letters/vowels').then((r) => r.json()),
      fetch('/api/letters/consonants').then((r) => r.json()),
    ])
      .then(([v, c]) => {
        setVowels(v)
        setConsonants(c)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[useLetters] fetch failed:', err.message)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { vowels, consonants, loading, error }
}

export function useShlokas() {
  const [shlokas, setShlokas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    fetch('/api/shlokas')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setShlokas(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[useShlokas] fetch failed:', err.message)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { shlokas, loading, error }
}
