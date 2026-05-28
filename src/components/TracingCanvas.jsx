import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTracing } from '../hooks/useTracing'

const VW = 720
const VH_WORD   = 290
const VH_LETTER = 360

function getFontSize(telugu) {
  const pts = [...telugu].length
  if (pts <= 4) return 158
  if (pts <= 6) return 138
  return 110
}

function getLetterFontSize(telugu) {
  const pts = [...telugu].length
  if (pts === 1) return 250
  if (pts <= 2) return 210
  return 175
}

// Pencil tip drawn at (cx, cy) — pencil points downward, tip at (cx, cy)
function PencilTip({ cx, cy, color, glow }) {
  // Pencil is 15px wide, tip starts at cy, body goes upward
  const bw = 15   // body width
  const bh = 30   // body height
  const tw = 10   // wood tip base width
  const th = 12   // wood tip height

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(-15)`} style={{ pointerEvents: 'none' }}>
      {/* Pulsing aura */}
      <circle r={26} fill={glow} opacity={0.25} />
      <circle r={16} fill={glow} opacity={0.20} />

      {/* Pencil body (colored, going up from y=-(th+bh) to y=-th) */}
      <rect
        x={-bw / 2} y={-(th + bh)} width={bw} height={bh} rx={3}
        fill={color}
        style={{ filter: `drop-shadow(0 3px 8px ${color}88)` }}
      />
      {/* Eraser end cap */}
      <rect x={-bw / 2} y={-(th + bh + 6)} width={bw} height={6} rx={2} fill="#F4A2A2" />

      {/* Body shine */}
      <rect x={-3} y={-(th + bh - 4)} width={5} height={bh - 8} rx={2} fill="white" opacity={0.28} />

      {/* Wooden tip (trapezoid) */}
      <polygon
        points={`${-tw / 2},${-th} ${tw / 2},${-th} 4,0 -4,0`}
        fill="#D4915A"
      />

      {/* Graphite point */}
      <circle cx={0} cy={0} r={3.5} fill="#4A4A4A" />
      <circle cx={0} cy={0} r={1.5} fill="#888" opacity={0.7} />
    </g>
  )
}

const PADDING = 28

// Fast estimate so the pencil starts near the letter immediately (no jump on font load)
function estimateBounds(telugu, isLetterMode) {
  const pts = [...telugu].length
  const fontSize = isLetterMode ? getLetterFontSize(telugu) : getFontSize(telugu)
  const estimatedWidth = isLetterMode
    ? fontSize * 0.88
    : Math.min(pts * fontSize * 0.58, VW * 0.9)
  const half = estimatedWidth / 2
  return {
    left: Math.max(0, VW / 2 - half - PADDING),
    right: Math.min(VW, VW / 2 + half + PADDING),
  }
}

export default function TracingCanvas({ word, speed, onComplete, replayRef, letterMode = false }) {
  const { phase, progress, replay } = useTracing({
    speed,
    autoReplay: true,
    onComplete,
  })

  useEffect(() => {
    if (replayRef) replayRef.current = replay
  }, [replay, replayRef])

  // Seed with a fast estimate, then refine with getBBox once fonts load
  const guideRef = useRef(null)
  const [bounds, setBounds] = useState(() => estimateBounds(word.telugu, letterMode))

  useEffect(() => {
    setBounds(estimateBounds(word.telugu, letterMode))
    const measure = async () => {
      await document.fonts.ready
      if (!guideRef.current) return
      try {
        const bbox = guideRef.current.getBBox()
        if (bbox.width > 0) {
          setBounds({
            left: Math.max(0, bbox.x - PADDING),
            right: Math.min(VW, bbox.x + bbox.width + PADDING),
          })
        }
      } catch {}
    }
    measure()
  }, [word.id])

  const VH = letterMode ? VH_LETTER : VH_WORD
  const fontSize = letterMode ? getLetterFontSize(word.telugu) : getFontSize(word.telugu)
  const textY = VH * (letterMode ? 0.80 : 0.82)
  const textX = VW / 2

  // Animation range: from left edge of text to right edge (with padding)
  // Falls back to full width until fonts are measured
  const rangeLeft = bounds?.left ?? 0
  const rangeRight = bounds?.right ?? VW
  const revealX = rangeLeft + progress * (rangeRight - rangeLeft)

  // Pencil tip tracks the reveal edge
  const tipX = Math.min(revealX, rangeRight - 8)
  const tipY = textY - fontSize * 0.42

  const maskId = `mask-${word.id}`

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full"
      style={{ display: 'block', overflow: 'visible', maxHeight: letterMode ? 260 : 200 }}
      aria-label={`Tracing animation for ${word.telugu}`}
    >
      <defs>
        {/* SVG mask: white = visible, black = hidden. Grows left → right */}
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <rect x={0} y={0} width={revealX} height={VH + 80} fill="white" />
        </mask>
      </defs>

      {/* ── Layer 1: dotted guide (always visible) ── */}
      <text
        ref={guideRef}
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        stroke="#C4C9D4"
        strokeWidth="2.5"
        strokeDasharray="8 6"
        fill="#DDE1EA"
        paintOrder="stroke fill"
        style={{ userSelect: 'none' }}
      >
        {word.telugu}
      </text>

      {/* ── Layer 2: soft glow halo (masked same as fill) ── */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={word.glow}
        mask={`url(#${maskId})`}
        style={{ userSelect: 'none', opacity: 0.5 }}
      >
        {word.telugu}
      </text>

      {/* ── Layer 3: color fill, revealed left→right by growing mask ── */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={word.color}
        mask={`url(#${maskId})`}
        style={{ userSelect: 'none' }}
      >
        {word.telugu}
      </text>

      {/* ── Pencil tip during animation ── */}
      {phase === 'animating' && (
        <PencilTip cx={tipX} cy={tipY} color={word.color} glow={word.glow} />
      )}

      {/* ── Completion checkmark ── */}
      {phase === 'done' && (
        <motion.g
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.3, 1.1, 0] }}
          transition={{ duration: 1.4 }}
        >
          <circle cx={VW - 34} cy={30} r={20} fill={word.color} opacity={0.92} />
          <path
            d={`M ${VW - 44} 30 l 8 8 l 14 -14`}
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </motion.g>
      )}
    </svg>
  )
}
