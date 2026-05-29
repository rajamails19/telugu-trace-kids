/**
 * StrokeGuide — static dotted-letter worksheet, no animation, no arrows.
 */

const VW = 720
const VH = 440

export default function StrokeGuide({ word }) {
  const fontSize = 260
  const textX = VW / 2
  const textY = VH * 0.74

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full"
      style={{ display: 'block', maxHeight: 340 }}
      aria-label={`Tracing guide for ${word.telugu}`}
    >
      {/* Soft filled shadow for depth */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        fill={`${word.glow}55`}
        style={{ userSelect: 'none' }}
      >
        {word.telugu}
      </text>

      {/* Dotted tracing outline */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        fontFamily="'Noto Sans Telugu', sans-serif"
        fontSize={fontSize}
        fontWeight="700"
        stroke={word.color}
        strokeWidth="3.5"
        strokeDasharray="11 8"
        fill="none"
        paintOrder="stroke fill"
        style={{ userSelect: 'none' }}
      >
        {word.telugu}
      </text>
    </svg>
  )
}
