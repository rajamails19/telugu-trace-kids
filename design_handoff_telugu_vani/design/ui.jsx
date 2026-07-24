// ui.jsx — shared primitives + TopNav for Telugu Vani.
(function () {
  const T = window.T;

  // ---- Decorative dotted background ----
  function DotField() {
    return (
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `radial-gradient(${'rgba(58,30,156,0.06)'} 1.4px, transparent 1.4px)`,
        backgroundSize: '22px 22px', backgroundPosition: '-8px -8px',
      }} />
    );
  }

  // ---- Eyebrow label (uppercase tracked) ----
  function Eyebrow({ children, dot = false, style }) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        fontFamily: T.sans, fontWeight: 800, fontSize: 12.5, letterSpacing: 2.2,
        textTransform: 'uppercase', color: T.orange, whiteSpace: 'nowrap', ...style,
      }}>
        {dot && <span style={{ width: 7, height: 7, borderRadius: 4, background: T.orange }} />}
        {children}
      </span>
    );
  }

  // ---- Buttons ----
  function Button({ children, variant = 'primary', onClick, style }) {
    const base = {
      fontFamily: T.sans, fontWeight: 800, fontSize: 16, cursor: 'pointer', whiteSpace: 'nowrap',
      border: 'none', borderRadius: 999, padding: '15px 26px',
      display: 'inline-flex', alignItems: 'center', gap: 9,
      transition: 'transform .18s cubic-bezier(.34,1.56,.64,1), box-shadow .18s, background .18s',
    };
    const variants = {
      primary: { background: T.orange, color: '#fff', boxShadow: '0 10px 22px -8px rgba(240,86,14,0.6)' },
      ghost:   { background: T.white, color: T.ink, boxShadow: '0 2px 0 rgba(58,30,156,0.04)', border: `1.5px solid ${T.border}` },
    };
    return (
      <button onClick={onClick} style={{ ...base, ...variants[variant], ...style }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
        {children}
      </button>
    );
  }

  // ---- Generic soft card ----
  function Card({ children, style, hover = false, onClick }) {
    return (
      <div onClick={onClick} style={{
        position: 'relative', background: T.creamCard, borderRadius: 26,
        boxShadow: '0 1px 0 rgba(58,30,156,0.04), 0 26px 50px -34px rgba(36,26,85,0.5)',
        border: `1px solid rgba(255,255,255,0.8)`, ...style,
      }}
      onMouseEnter={hover ? (e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(58,30,156,0.04), 0 38px 60px -34px rgba(36,26,85,0.55)'; }) : undefined}
      onMouseLeave={hover ? (e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 0 rgba(58,30,156,0.04), 0 26px 50px -34px rgba(36,26,85,0.5)'; }) : undefined}
      >{children}</div>
    );
  }

  // ---- Decorative petal blob (top-right corner of cards) ----
  function PetalBlob({ color, size = 88, style }) {
    return <div aria-hidden style={{ position: 'absolute', width: size, height: size, borderRadius: '46% 54% 50% 50%', background: color, opacity: 0.5, filter: 'blur(2px)', ...style }} />;
  }

  // ---- Round icon badge ----
  function IconBadge({ bg, children, size = 52, glyph = false }) {
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.36, background: bg, flexShrink: 0,
        display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px -8px rgba(36,26,85,0.45)',
        fontFamily: glyph ? T.te : T.sans, color: '#fff', fontWeight: 700, fontSize: size * 0.4, lineHeight: 1,
      }}>{children}</div>
    );
  }

  // ---- Top floating pill nav ----
  const NAV = [
    { key: 'home', label: 'Home' },
    { key: 'tracing', label: 'Tracing' },
    { key: 'shlokas', label: 'Shlokas' },
    { key: 'progress', label: 'Progress' },
    { key: 'admin', label: 'Admin' },
  ];
  function TopNav({ route, go }) {
    return (
      <div style={{ position: 'sticky', top: 0, zIndex: 50, padding: '20px 24px 8px', display: 'flex', justifyContent: 'center' }}>
        <nav style={{
          width: '100%', maxWidth: 1180, background: 'rgba(255,253,248,0.94)', backdropFilter: 'blur(14px)',
          borderRadius: 999, padding: '11px 14px 11px 14px', display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 18px 40px -26px rgba(36,26,85,0.5), 0 1px 0 rgba(255,255,255,0.9) inset',
          border: '1px solid rgba(255,255,255,0.9)',
        }}>
          {/* brand */}
          <button onClick={() => go('home')} style={{ display: 'flex', alignItems: 'center', gap: 11, border: 'none', background: 'none', cursor: 'pointer', padding: '4px 8px' }}>
            <span style={{ width: 38, height: 38, borderRadius: 13, background: T.orange, display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px -7px rgba(240,86,14,0.7)' }}>
              <span style={{ fontFamily: T.te, color: '#fff', fontWeight: 700, fontSize: 21 }}>వ</span>
            </span>
            <span style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 22, color: T.ink, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>Telugu Vani</span>
          </button>
          {/* links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, margin: '0 auto' }} className="tv-navlinks">
            {NAV.map(n => {
              const active = route === n.key;
              return (
                <button key={n.key} onClick={() => go(n.key)} style={{
                  fontFamily: T.sans, fontWeight: 700, fontSize: 15.5, cursor: 'pointer', border: 'none',
                  padding: '9px 18px', borderRadius: 999,
                  background: active ? T.peach : 'transparent',
                  color: active ? T.orange : T.ink,
                  transition: 'background .2s, color .2s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(58,30,156,0.05)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >{n.label}</button>
              );
            })}
          </div>
          {/* avatar */}
          <button style={{ width: 42, height: 42, borderRadius: '50%', border: `2.5px solid ${T.gold}`, background: '#FFF6E2', cursor: 'pointer', display: 'grid', placeItems: 'center', fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: T.orange, flexShrink: 0 }}>SJ</button>
        </nav>
      </div>
    );
  }

  // ---- Footer ----
  function Footer() {
    return (
      <div style={{ textAlign: 'center', padding: '46px 0 40px', position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: T.sans, fontWeight: 700, fontSize: 12.5, letterSpacing: 3, textTransform: 'uppercase', color: T.inkSoft, opacity: 0.7 }}>
          Telugu Vani · <span style={{ fontFamily: T.te }}>ఓం నమః</span>
        </span>
      </div>
    );
  }

  // ---- Section heading (serif, optional Telugu trailing) ----
  function SectionTitle({ children, te, style }) {
    return (
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, ...style }}>
        <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(28px,3.4vw,40px)', color: T.ink, margin: 0, lineHeight: 1.05 }}>{children}</h2>
        {te && <span style={{ fontFamily: T.te, fontWeight: 700, fontSize: 17, color: T.inkSoft }}>{te}</span>}
      </div>
    );
  }

  // ---- Page wrapper: centers content, adds entrance transition ----
  function Page({ children, k }) {
    return (
      <main key={k} style={{ position: 'relative', zIndex: 1, maxWidth: 1180, margin: '0 auto', padding: '0 24px', animation: 'tvPageIn .5s cubic-bezier(.22,1,.36,1) both' }}>
        {children}
      </main>
    );
  }

  Object.assign(window, { DotField, Eyebrow, Button, Card, PetalBlob, IconBadge, TopNav, Footer, SectionTitle, Page });
})();
