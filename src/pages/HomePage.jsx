/**
 * HomePage.jsx — Premium landing page for Telugu Vani.
 *
 * Hero 2-col grid + 3 ritual cards. All navigation via React Router.
 */

import { useNavigate } from 'react-router-dom'
import {
  T, DotField, Eyebrow, TVButton, TVCard, PetalBlob,
  IconBadge, SectionTitle, TVPage, TVFooter, mandalaDataURI,
} from '../components/TV'

function HeroStat({ n, label }) {
  return (
    <div>
      <div style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 30, color: T.ink, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 11.5, letterSpacing: 1.6, textTransform: 'uppercase', color: T.inkSoft, marginTop: 6 }}>{label}</div>
    </div>
  )
}

function RitualCard({ badge, badgeBg, glyph, glyphIsTe, cat, title, body, onClick, i }) {
  return (
    <TVCard hover onClick={onClick} style={{ padding: 26, cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 16, animation: `tvRise .6s ${0.08 * i}s both` }}>
      <PetalBlob color={badgeBg} style={{ top: -22, right: -22, opacity: 0.16 }} />
      <IconBadge bg={badgeBg} glyph={glyphIsTe}>{glyph}</IconBadge>
      <div style={{ marginTop: 4 }}>
        <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: badge, marginBottom: 8 }}>{cat}</div>
        <h3 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 25, color: T.ink, margin: '0 0 10px', lineHeight: 1.1 }}>{title}</h3>
        <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 15.5, lineHeight: 1.55, color: T.inkSoft, margin: 0 }}>{body}</p>
      </div>
      <div style={{ marginTop: 'auto', paddingTop: 10, fontFamily: T.sans, fontWeight: 800, fontSize: 15, color: T.orange, display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        Open <span style={{ display: 'inline-block', transition: 'transform .2s' }}>→</span>
      </div>
    </TVCard>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100svh', position: 'relative' }}>
      <DotField />
      <TVPage>

        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="tv-hero" style={{ padding: '38px 0 16px' }}>

          {/* Left: copy */}
          <div style={{ animation: 'tvRise .6s .05s both' }}>
            <span style={{ display: 'inline-flex', background: 'rgba(245,182,43,0.16)', borderRadius: 999, padding: '8px 16px' }}>
              <Eyebrow dot>Built for kids · Loved by parents</Eyebrow>
            </span>

            <h1 style={{
              fontFamily: T.serif, fontWeight: 800,
              fontSize: 'clamp(40px,6vw,72px)', color: T.ink,
              lineHeight: 1.02, margin: '22px 0 0', letterSpacing: '-0.5px',
            }}>
              Telugu, taught the way it was{' '}
              <em style={{ fontStyle: 'italic', color: T.orange }}>always meant</em> to be.
            </h1>

            <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 19, lineHeight: 1.6, color: T.inkSoft, margin: '24px 0 0', maxWidth: 480 }}>
              A premium learning ritual — letter by letter, shloka by shloka.
              Beautifully designed for small hands and curious minds.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', margin: '30px 0 0' }}>
              <TVButton onClick={() => navigate('/tracing')}>Start tracing →</TVButton>
              <TVButton variant="ghost" onClick={() => navigate('/shlokas')}>Browse shlokas</TVButton>
            </div>

            <div style={{ display: 'flex', gap: 38, margin: '36px 0 0' }}>
              <HeroStat n="56"   label="Letters" />
              <HeroStat n="14"   label="Shlokas" />
              <HeroStat n="4.9★" label="Parent rating" />
            </div>
          </div>

          {/* Right: deity panel with mandala */}
          <div style={{ display: 'flex', justifyContent: 'center', animation: 'tvRise .6s .15s both' }}>
            <div style={{ position: 'relative' }}>
              {/* petal glow blob behind */}
              <div aria-hidden style={{ position: 'absolute', inset: -18, borderRadius: 44, background: T.petal, opacity: 0.5, transform: 'rotate(-4deg)' }} />
              {/* deity panel */}
              <div style={{
                position: 'relative', width: 'min(420px, 80vw)', aspectRatio: '1',
                borderRadius: 36, overflow: 'hidden',
                background: `radial-gradient(120% 120% at 50% 30%, #2E2270 0%, ${T.inkDeep} 70%)`,
                boxShadow: '0 40px 70px -30px rgba(36,26,85,0.7), 0 0 0 1px rgba(245,182,43,0.25) inset',
                padding: 10,
              }}>
                {/* animated glow overlay */}
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(246,194,90,0.35), transparent 60%)', animation: 'tvGlow 5s ease-in-out infinite' }} />
                {/* mandala fallback image */}
                <img
                  src={mandalaDataURI()}
                  alt="Telugu Vani"
                  style={{ position: 'relative', width: '100%', height: '100%', display: 'block', objectFit: 'cover', borderRadius: 28 }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Three rituals ─────────────────────────────────────── */}
        <section style={{ padding: '54px 0 10px' }}>
          <SectionTitle te="మూడు మార్గాలు">Three rituals, one beautiful journey</SectionTitle>
          <div className="tv-cards" style={{ marginTop: 28 }}>
            <RitualCard
              i={0} onClick={() => navigate('/tracing')}
              badge={T.orange} badgeBg={T.orange}
              glyph="అ" glyphIsTe
              cat="Practice" title="Letter Tracing"
              body="Glide through every అ to హ with guided strokes designed by Telugu teachers."
            />
            <RitualCard
              i={1} onClick={() => navigate('/shlokas')}
              badge={T.ink} badgeBg={T.ink}
              glyph="ఓం" glyphIsTe
              cat="Recite" title="Sacred Shlokas"
              body="Daily verses with pronunciation, meaning, and a calm read-along voice."
            />
            <RitualCard
              i={2} onClick={() => navigate('/progress')}
              badge={T.orangeDk} badgeBg={T.gold}
              glyph="★"
              cat="Track" title="Your Journey"
              body="Streaks, milestones and tiny trophies that keep little learners coming back."
            />
          </div>
        </section>

      </TVPage>
      <TVFooter />
    </div>
  )
}
