import { motion } from 'framer-motion'

const CATS = [
  { key: 'vowel',     label: 'Vowels',      count: 14 },
  { key: 'consonant', label: 'Consonants',  count: 30 },
]

export default function CategoryToggle({ active, onChange }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {CATS.map((cat) => {
        const isActive = active === cat.key
        return (
          <motion.button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            whileTap={{ scale: 0.94 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200"
            style={
              isActive
                ? { background: '#1E293B', color: 'white', boxShadow: '0 4px 12px #1E293B44' }
                : { background: 'white', color: '#64748B', border: '2px solid #E2E8F0' }
            }
          >
            <span>{cat.label}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={
                isActive
                  ? { background: 'rgba(255,255,255,0.2)', color: 'white' }
                  : { background: '#F1F5F9', color: '#94A3B8' }
              }
            >
              {cat.count}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
