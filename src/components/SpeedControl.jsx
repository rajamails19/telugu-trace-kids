import { motion } from 'framer-motion'

const OPTIONS = [
  { key: 'slow',   label: 'Slow',   icon: '🐢' },
  { key: 'medium', label: 'Medium', icon: '🐇' },
  { key: 'fast',   label: 'Fast',   icon: '⚡' },
]

export default function SpeedControl({ speed, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-amber-700/60 uppercase tracking-widest mr-1">
        Speed
      </span>
      {OPTIONS.map((opt) => {
        const active = speed === opt.key
        return (
          <motion.button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            whileTap={{ scale: 0.91 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200"
            style={
              active
                ? { background: '#F59E0B', color: 'white', boxShadow: '0 4px 12px #F59E0B55', border: '2px solid #F59E0B' }
                : { background: 'white', color: '#92400E', border: '2px solid #FDE68A' }
            }
          >
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
