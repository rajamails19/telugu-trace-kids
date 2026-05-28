import { motion } from 'framer-motion'

const TABS = [
  { key: 'letters', label: 'Letters', icon: '🔤' },
  { key: 'words',   label: 'Words',   icon: '📖' },
]

export default function TabBar({ active, onChange }) {
  return (
    <div className="flex bg-white/90 backdrop-blur-sm rounded-2xl p-1.5 gap-1"
      style={{ boxShadow: '0 2px 16px #F59E0B22, 0 1px 4px #0000000d', border: '1.5px solid #FDE68A' }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className="relative flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-colors duration-200 flex items-center justify-center gap-2"
            style={{ color: isActive ? 'white' : '#92400E' }}
          >
            {isActive && (
              <motion.div
                layoutId="tabPill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #EA580C)', boxShadow: '0 4px 12px #F59E0B55' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-base">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}
    </div>
  )
}
