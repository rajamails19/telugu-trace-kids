/**
 * StrokeGuide — static dotted-letter worksheet with numbered stroke arrows.
 * No animation. Positions come from getBBox so they follow the actual glyphs.
 */
import { useRef, useState, useEffect } from 'react'

const VW = 720
const VH = 310

// Stroke colours — one per stroke number
const STROKE_COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B']

/**
 * Stroke definitions as fractions (rx, ry) of the word's bounding box.
 * angle = direction the arrow points (0° = right, 90° = down, 180° = left, 270° = up).
 *
 * These are tuned for  అమ్మ  at fontSize 158, but the fraction approach means
 * they'll still be sensible if the font metrics shift slightly.
 *
 * Telugu stroke order reference:
 *  అ  – 1) top-right loop → curve counterclockwise   2) bottom-left hook → right
 *  మ్మ – 3) top horizontal curve → right               4) descending body → down
 */
const AMMA_STROKE_DEFS = [
  { id: 1, rx: 0.27, ry: 0.16, angle: 220 },   // అ — start top, go down-left
  { id: 2, rx: 0.04, ry: 0.80, angle: 22  },   // అ — bottom hook → right
  { id: 3, rx: 0.47, ry: 0.08, angle: 8   },   // మ — top curve → right
  { id: 4, rx: 0.80, ry: 0.42, angle: 96  },   // మ — descending body → down
]

function ArrowMarker({ cx, cy, angle, color, number }) {
  const R = 20          // circle radius
  const LINE = 42       // arrow shaft length (from circle edge)
  const HEAD = 13       // arrowhead arm length

  const rad = (angle * Math.PI) / 180
  // shaft starts at circle edge, ends LINE px further
  const sx = cx + Math.cos(rad) * R
  const sy = cy + Math.sin(rad) * R
  const ex = cx + Math.cos(rad) * (R + LINE)
  const ey = cy + Math.sin(rad) * (R + LINE)
  // arrowhead arms
  const a1r = ((angle + 145) * Math.PI) / 180
  const a2r = ((angle - 145) * Math.PI) / 180

  return (
    <g>
      {/* Glow ring */}
      <circle cx={cx} cy={cy} r={R + 5} fill={color} opacity={0.18} />

      {/* Arrow shaft */}
      <line x1={sx} y1={sy} x2={ex} y2={ey}
        stroke={color} strokeWidth={4} strokeLinecap="round" />

      {/* Arrowhead */}
      <line x1={ex} y1={ey}
        x2={ex + Math.cos(a1r) * HEAD} y2={ey + Math.sin(a1r) * HEAD}
        stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={ex} y1={ey}
        x2={ex + Math.cos(a2r) * HEAD} y2={ey + Math.sin(a2r) * HEAD}
        stroke={color} strokeWidth={4} strokeLinecap="round" />

      {/* Numbered circle */}
      <circle cx={cx} cy={cy} r={R} fill={color} />
      <text x={cx} y={cy + 7} textAnchor="middle" fill="white"
        fontWeight="800" fontSize={17} fontFamily="'Nunito', sans-serif">
        {number}
      </text>
    </g>
  )
}

export default function StrokeGuide({ word, strokeDefs = AMMA_STROKE_DEFS }) {
  const textRef = useRef(null)
  const [strokes, setStrokes] = useState([])

  const fontSize = 158
  const textX = VW / 2
  const textY = VH * 0.84

  useEffect(() => {
    const measure = async () => {
      await document.fonts.ready
      if (!textRef.current) return
      try {
        const b = textRef.current.getBBox()
        if (b.width > 0) {
          setStrokes(strokeDefs.map((def, i) => ({
            ...def,
            cx: b.x + def.rx * b.width,
            cy: b.y + def.ry * b.height,
            color: STROKE_COLORS[i % STROKE_COLORS.length],
          })))
        }
      } catch {}
    }
    measure()
  }, [word.id, strokeDefs])

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full"
      style={{ display: 'block', maxHeight: 220 }}
      aria-label={`Stroke order guide for ${word.telugu}`}
    >
      {/* ── Dotted tracing outline ── */}
      <text
        ref={textRef}
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        stroke={word.glow}
        strokeWidth="3.5"
        strokeDasharray="11 8"
        fill={`${word.light}`}
        paintOrder="stroke fill"
        style={{ userSelect: 'none' }}
      >
        {word.telugu}
      </text>

      {/* ── Stroke number arrows ── */}
      {strokes.map(s => (
        <ArrowMarker
          key={s.id}
          cx={s.cx} cy={s.cy}
          angle={s.angle}
          color={s.color}
          number={s.id}
        />
      ))}
    </svg>
  )
}
