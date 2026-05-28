import { motion } from 'framer-motion'

export default function Navigation({ onPrev, onNext, canPrev, canNext, currentIndex, total }) {
  return (
    <div className="flex items-center justify-between w-full gap-4">
      <motion.button
        onClick={onPrev}
        disabled={!canPrev}
        whileTap={canPrev ? { scale: 0.92 } : {}}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all duration-200"
        style={
          canPrev
            ? { background: 'white', color: '#92400E', border: '2px solid #FDE68A', boxShadow: '0 2px 8px #0000000d' }
            : { background: '#F1F5F9', color: '#CBD5E1', border: '2px solid #F1F5F9', cursor: 'not-allowed' }
        }
      >
        <span>←</span>
        <span>Prev</span>
      </motion.button>

      {/* Dot indicators for small sets, numeric counter for large */}
      {total <= 15 ? (
        <div className="flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentIndex ? 24 : 10,
                height: 10,
                background: i === currentIndex ? '#F59E0B' : '#FDE68A',
              }}
            />
          ))}
        </div>
      ) : (
        <span className="text-sm font-extrabold text-amber-600/70 tabular-nums">
          {currentIndex + 1} / {total}
        </span>
      )}

      <motion.button
        onClick={onNext}
        disabled={!canNext}
        whileTap={canNext ? { scale: 0.92 } : {}}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-base transition-all duration-200"
        style={
          canNext
            ? { background: '#F59E0B', color: 'white', border: '2px solid #F59E0B', boxShadow: '0 4px 14px #F59E0B55' }
            : { background: '#F1F5F9', color: '#CBD5E1', border: '2px solid #F1F5F9', cursor: 'not-allowed' }
        }
      >
        <span>Next</span>
        <span>→</span>
      </motion.button>
    </div>
  )
}
