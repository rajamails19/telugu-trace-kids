/**
 * TV.jsx — Shared design-system primitives for Telugu Vani premium redesign.
 * Exports: T (tokens), DEITY_TINT, DEITY_KEYS, mandalaDataURI,
 *          DotField, Eyebrow, TVButton, TVCard, PetalBlob,
 *          IconBadge, SectionTitle, TVPage, TVFooter
 */

// ── Design tokens ────────────────────────────────────────────────────────────
export const T = {
  cream:    '#FBF4E4',
  creamCard:'#FFFDF8',
  white:    '#FFFFFF',
  ink:      '#3A1E9C',
  inkDeep:  '#241A55',
  inkSoft:  '#8E89A8',
  orange:   '#F0560E',
  orangeDk: '#D2480A',
  gold:     '#F5B62B',
  peach:    '#FCE6D6',
  petal:    '#F8D9A0',
  border:   'rgba(58,30,156,0.10)',
  serif:    "'Playfair Display', Georgia, 'Times New Roman', serif",
  sans:     "'Mulish', system-ui, -apple-system, sans-serif",
  te:       "'Noto Sans Telugu', sans-serif",
  teSerif:  "'Ramaraja', 'Noto Serif Telugu', serif",
}

// ── Per-deity jewel-tone panel tints ────────────────────────────────────────
export const DEITY_TINT = {
  ganesha:  '#241A55', saraswati:'#2E1B57', guru:     '#142A4E', gayatri: '#3A2350',
  hanuman:  '#4A1730', karagre:  '#4A1838', shanti:   '#0F3A38', annapurna:'#14392A',
  vishnu:   '#16285C', rivers:   '#0D3548', deepam:   '#3E2613', shani:   '#221C52',
  surya:    '#4A2613', hayagriva:'#321552',
}

// Deity key ordered by shloka ID (matches our shlokas.js seed order)
export const DEITY_KEYS = [
  'ganesha','saraswati','guru','gayatri','hanuman','karagre',
  'shanti','annapurna','vishnu','rivers','deepam','shani','surya','hayagriva',
]

// ── Gold mandala SVG (deity panel fallback) ──────────────────────────────────
export function mandalaDataURI() {
  const gold = '#F6C25A', gold2 = '#E89A2B', glow = '#FBD98A'
  const cx = 200, cy = 200
  let petals = ''
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * 360
    petals += `<g transform="rotate(${a} ${cx} ${cy})">
      <path d="M${cx} ${cy-150} q22 30 0 70 q-22-40 0-70 z" fill="${gold}" opacity="0.9"/>
      <circle cx="${cx}" cy="${cy-158}" r="5" fill="${glow}"/>
    </g>`
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 360 + 15
    petals += `<g transform="rotate(${a} ${cx} ${cy})">
      <path d="M${cx} ${cy-110} q16 24 0 52 q-16-28 0-52 z" fill="${gold2}" opacity="0.95"/>
    </g>`
  }
  const rings = [150,128,98,74,52].map((r,i) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${gold}" stroke-width="${i%2?1:2}" stroke-dasharray="${i%2?'3 6':'8 5'}" opacity="${(0.65-i*0.07).toFixed(2)}"/>`
  ).join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs><radialGradient id="cgl" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${gold2}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${gold2}" stop-opacity="0"/>
    </radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="170" fill="url(#cgl)"/>
    ${petals}${rings}
    <circle cx="${cx}" cy="${cy}" r="40" fill="#2A1F63" stroke="${gold}" stroke-width="2"/>
    <text x="${cx}" y="${cy+18}" font-family="'Noto Sans Telugu',sans-serif" font-size="46" font-weight="700" fill="${glow}" text-anchor="middle">ఓం</text>
  </svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

// ── Components ───────────────────────────────────────────────────────────────

/** Fixed dot-grid background (covers the full viewport). */
export function DotField() {
  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
      backgroundImage: 'radial-gradient(rgba(58,30,156,0.06) 1.4px, transparent 1.4px)',
      backgroundSize: '22px 22px', backgroundPosition: '-8px -8px',
    }} />
  )
}

/** Uppercase eyebrow label in orange. */
export function Eyebrow({ children, dot = false, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: T.sans, fontWeight: 800, fontSize: 12.5,
      letterSpacing: 2.2, textTransform: 'uppercase', color: T.orange,
      whiteSpace: 'nowrap', ...style,
    }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: T.orange, flexShrink: 0 }} />}
      {children}
    </span>
  )
}

/** Primary (orange) or ghost (white) button. */
export function TVButton({ children, variant = 'primary', onClick, style, disabled, type }) {
  const variants = {
    primary: { background: T.orange, color: '#fff', boxShadow: '0 10px 22px -8px rgba(240,86,14,0.6)', border: 'none' },
    ghost:   { background: T.white,  color: T.ink,  boxShadow: '0 2px 0 rgba(58,30,156,0.04)', border: `1.5px solid ${T.border}` },
    indigo:  { background: T.ink,    color: '#fff',  boxShadow: '0 10px 22px -8px rgba(58,30,156,0.5)', border: 'none' },
  }
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        fontFamily: T.sans, fontWeight: 800, fontSize: 16,
        cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
        borderRadius: 999, padding: '13px 24px',
        display: 'inline-flex', alignItems: 'center', gap: 9,
        transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s',
        opacity: disabled ? 0.6 : 1,
        ...variants[variant], ...style,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none' }}
    >
      {children}
    </button>
  )
}

/** Soft cream card with optional hover lift. */
export function TVCard({ children, style, hover = false, onClick }) {
  const base = {
    position: 'relative', background: T.creamCard, borderRadius: 26,
    boxShadow: '0 1px 0 rgba(58,30,156,0.04), 0 26px 50px -34px rgba(36,26,85,0.5)',
    border: `1px solid rgba(255,255,255,0.8)`,
    transition: 'transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s',
    ...style,
  }
  return (
    <div
      onClick={onClick}
      style={base}
      onMouseEnter={hover ? e => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 1px 0 rgba(58,30,156,0.04), 0 38px 60px -34px rgba(36,26,85,0.55)'
      } : undefined}
      onMouseLeave={hover ? e => {
        e.currentTarget.style.transform = 'none'
        e.currentTarget.style.boxShadow = '0 1px 0 rgba(58,30,156,0.04), 0 26px 50px -34px rgba(36,26,85,0.5)'
      } : undefined}
    >
      {children}
    </div>
  )
}

/** Decorative soft blob (corner of cards). */
export function PetalBlob({ color, size = 88, style }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', width: size, height: size,
      borderRadius: '46% 54% 50% 50%', background: color,
      opacity: 0.5, filter: 'blur(2px)', ...style,
    }} />
  )
}

/** Round icon badge (for ritual cards). */
export function IconBadge({ bg, children, size = 52, glyph = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.36, background: bg, flexShrink: 0,
      display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px -8px rgba(36,26,85,0.45)',
      fontFamily: glyph ? T.te : T.sans, color: '#fff', fontWeight: 700,
      fontSize: size * 0.4, lineHeight: 1,
    }}>
      {children}
    </div>
  )
}

/** Section heading in Playfair Display with optional Telugu trailing label. */
export function SectionTitle({ children, te, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, ...style }}>
      <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(28px,3.4vw,40px)', color: T.ink, margin: 0, lineHeight: 1.05 }}>
        {children}
      </h2>
      {te && <span style={{ fontFamily: T.te, fontWeight: 700, fontSize: 17, color: T.inkSoft }}>{te}</span>}
    </div>
  )
}

/** Page content wrapper: centers, max-width 1180, entrance animation. */
export function TVPage({ children }) {
  return (
    <main style={{
      position: 'relative', zIndex: 1,
      maxWidth: 1180, margin: '0 auto', padding: '0 24px 60px',
      animation: 'tvPageIn .5s cubic-bezier(.22,1,.36,1) both',
    }}>
      {children}
    </main>
  )
}

/** Footer with Telugu script. */
export function TVFooter() {
  return (
    <div style={{ textAlign: 'center', padding: '46px 0 40px', position: 'relative', zIndex: 1 }}>
      <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 12.5, letterSpacing: 3, textTransform: 'uppercase', color: T.inkSoft, opacity: 0.7 }}>
        Telugu Vani · <span style={{ fontFamily: T.te }}>ఓం నమః</span>
      </span>
    </div>
  )
}
