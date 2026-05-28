import { AnimatePresence, motion } from 'framer-motion'

const BURST = [
  { angle: 0,   dist: 70,  size: 18, color: '#F59E0B', delay: 0.00 },
  { angle: 45,  dist: 80,  size: 14, color: '#EF4444', delay: 0.05 },
  { angle: 90,  dist: 65,  size: 20, color: '#3B82F6', delay: 0.02 },
  { angle: 135, dist: 75,  size: 12, color: '#10B981', delay: 0.08 },
  { angle: 180, dist: 72,  size: 16, color: '#8B5CF6', delay: 0.03 },
  { angle: 225, dist: 68,  size: 14, color: '#EC4899', delay: 0.06 },
  { angle: 270, dist: 78,  size: 18, color: '#F59E0B', delay: 0.01 },
  { angle: 315, dist: 62,  size: 12, color: '#EF4444', delay: 0.07 },
  { angle: 22,  dist: 100, size: 10, color: '#3B82F6', delay: 0.10 },
  { angle: 160, dist: 95,  size: 10, color: '#10B981', delay: 0.09 },
]

function StarParticle({ angle, dist, size, color, delay }) {
  const rad = (angle * Math.PI) / 180
  const tx = Math.cos(rad) * dist
  const ty = Math.sin(rad) * dist

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '50%', top: '40%', marginLeft: -size / 2, marginTop: -size / 2 }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0, rotate: 0 }}
      animate={{ opacity: [0, 1, 1, 0], x: tx, y: ty, scale: [0, 1.3, 1, 0], rotate: 180 }}
      transition={{ duration: 1.1, delay, ease: 'easeOut' }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M12 2l2.09 6.26L21 9.27l-5 4.87 1.18 6.88L12 17.77l-5.18 3.25L8 14.14 3 9.27l6.91-1.01z" />
      </svg>
    </motion.div>
  )
}

export default function Sparkle({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {BURST.map((p, i) => (
            <StarParticle key={i} {...p} />
          ))}
        </div>
      )}
    </AnimatePresence>
  )
}
