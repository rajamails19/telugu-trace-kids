import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import TabBar from './components/TabBar'
import CategoryToggle from './components/CategoryToggle'
import WordCard from './components/WordCard'
import LetterCard from './components/LetterCard'
import SpeedControl from './components/SpeedControl'
import Navigation from './components/Navigation'
import JumpSelect from './components/JumpSelect'
import { words } from './data/words'
import { vowels, consonants } from './data/letters'

export default function App() {
  const [tab, setTab]                   = useState('words')
  const [category, setCategory]         = useState('vowel')
  const [wordIndex, setWordIndex]       = useState(0)
  const [vowelIndex, setVowelIndex]     = useState(0)
  const [consonantIndex, setConsonantIndex] = useState(0)
  const [speed, setSpeed]               = useState('slow')

  const letters = category === 'vowel' ? vowels : consonants
  const letterIndex = category === 'vowel' ? vowelIndex : consonantIndex
  const setLetterIndex = category === 'vowel' ? setVowelIndex : setConsonantIndex

  // Reset letter index when switching category
  const handleCategoryChange = (cat) => {
    setCategory(cat)
  }

  // Reset tab index when switching tabs
  const handleTabChange = (t) => {
    setTab(t)
  }

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') {
        if (tab === 'words') setWordIndex((i) => Math.min(i + 1, words.length - 1))
        else setLetterIndex((i) => Math.min(i + 1, letters.length - 1))
      }
      if (e.key === 'ArrowLeft') {
        if (tab === 'words') setWordIndex((i) => Math.max(i - 1, 0))
        else setLetterIndex((i) => Math.max(i - 1, 0))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [tab, letters.length, setLetterIndex])

  const currentWord   = words[wordIndex]
  const currentLetter = letters[letterIndex]

  return (
    <div
      className="min-h-screen py-4 px-4"
      style={{ background: 'linear-gradient(160deg, #FFFBF0 0%, #FEF3C7 45%, #FFF9F0 100%)' }}
    >
      {/* Dot grid backdrop */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F59E0B22 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-xl mx-auto flex flex-col gap-4">
        <Header />

        {/* ── Main Tab Bar ── */}
        <TabBar active={tab} onChange={handleTabChange} />

        {/* ── Letters: category sub-toggle ── */}
        {tab === 'letters' && (
          <CategoryToggle active={category} onChange={handleCategoryChange} />
        )}

        {/* ── Card area ── */}
        <AnimatePresence mode="wait">
          {tab === 'words' ? (
            <WordCard
              key={`word-${currentWord.id}`}
              word={currentWord}
              speed={speed}
              wordNumber={wordIndex + 1}
              total={words.length}
            />
          ) : (
            <LetterCard
              key={`letter-${currentLetter.id}`}
              letter={currentLetter}
              speed={speed}
              letterNumber={letterIndex + 1}
              total={letters.length}
            />
          )}
        </AnimatePresence>

        {/* ── Controls ── */}
        <div className="flex flex-col items-center gap-4">
          <SpeedControl speed={speed} onChange={setSpeed} />

          {tab === 'words' ? (
            <>
              <JumpSelect
                items={words}
                currentIndex={wordIndex}
                onChange={setWordIndex}
                getLabel={(item, i) => `${i + 1}. ${item.telugu} — ${item.english}`}
                color={currentWord.color}
              />
              <Navigation
                onPrev={() => setWordIndex((i) => Math.max(i - 1, 0))}
                onNext={() => setWordIndex((i) => Math.min(i + 1, words.length - 1))}
                canPrev={wordIndex > 0}
                canNext={wordIndex < words.length - 1}
                currentIndex={wordIndex}
                total={words.length}
              />
            </>
          ) : (
            <>
              <JumpSelect
                items={letters}
                currentIndex={letterIndex}
                onChange={setLetterIndex}
                getLabel={(item, i) => `${i + 1}. ${item.telugu}  (${item.roman})`}
                color={currentLetter.color}
              />
              <Navigation
                onPrev={() => setLetterIndex((i) => Math.max(i - 1, 0))}
                onNext={() => setLetterIndex((i) => Math.min(i + 1, letters.length - 1))}
                canPrev={letterIndex > 0}
                canNext={letterIndex < letters.length - 1}
                currentIndex={letterIndex}
                total={letters.length}
              />
            </>
          )}
        </div>

        <p className="text-center text-xs text-amber-600/50 font-semibold pb-4">
          Telugu Trace Kids · Learning through watching &amp; tracing
        </p>
      </div>
    </div>
  )
}
