import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function JumpSelect({ items, currentIndex, onChange, getLabel, color }) {
  const selectRef = useRef(null)

  return (
    <motion.div
      className="flex items-center gap-2.5 px-4 py-2 rounded-2xl"
      style={{ background: 'white', border: '2px solid #FDE68A', boxShadow: '0 2px 8px #F59E0B18' }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-xs font-extrabold text-amber-600/70 uppercase tracking-widest whitespace-nowrap">
        Jump to
      </span>

      <div className="relative flex-1 min-w-0">
        <select
          ref={selectRef}
          value={currentIndex}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full appearance-none pl-3 pr-7 py-1 rounded-xl text-sm font-bold cursor-pointer focus:outline-none truncate"
          style={{
            background: color ? `${color}12` : '#FFF7ED',
            color: color ?? '#92400E',
            border: 'none',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          {items.map((item, i) => (
            <option key={item.id} value={i}>
              {getLabel(item, i)}
            </option>
          ))}
        </select>

        {/* Dropdown chevron */}
        <div
          className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-xs"
          style={{ color: color ?? '#F59E0B' }}
        >
          ▼
        </div>
      </div>
    </motion.div>
  )
}
