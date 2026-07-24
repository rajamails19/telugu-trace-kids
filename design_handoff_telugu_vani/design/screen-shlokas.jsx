// screen-shlokas.jsx
(function () {
  const T = window.T;
  const { useState } = React;

  function Accordion({ title, te, children, open, onToggle }) {
    return (
      <div style={{ borderTop: `1px solid ${T.border}` }}>
        <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 4px', textAlign: 'left' }}>
          <span style={{ fontFamily: te ? T.te : T.serif, fontWeight: 700, fontSize: 18, color: T.ink, whiteSpace: 'nowrap' }}>
            {te ? <span><span style={{ fontFamily: T.te }}>{te}</span> <span style={{ fontFamily: T.serif, color: T.inkSoft, fontSize: 16 }}>· {title}</span></span> : title}
          </span>
          <span style={{ width: 32, height: 32, borderRadius: '50%', background: T.peach, color: T.orange, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>▼</span>
        </button>
        <div style={{ maxHeight: open ? 240 : 0, overflow: 'hidden', transition: 'max-height .35s ease, opacity .3s', opacity: open ? 1 : 0 }}>
          <div style={{ padding: '0 4px 22px' }}>{children}</div>
        </div>
      </div>
    );
  }

  function Shlokas({ go }) {
    const { Eyebrow, Card, Button } = window;
    const [idx, setIdx] = useState(0);
    const [open, setOpen] = useState('meaning');
    const list = window.DEITIES;
    const deity = list[idx].key;
    const g = window.SHLOKAS[deity];
    const total = list.length;
    function goIdx(n) { setIdx((n + total) % total); setOpen('meaning'); }

    return (
      <>
        <div style={{ textAlign: 'center', padding: '34px 0 26px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Daily recitation</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>Nitya Shlokas</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: '0 0 18px' }}>Sacred verses with correct pronunciation and gentle meaning — for tiny voices.</p>
          <span style={{ display: 'inline-block', background: T.white, border: `1px solid ${T.border}`, borderRadius: 999, padding: '7px 18px', fontFamily: T.sans, fontWeight: 800, fontSize: 14, color: T.ink }}>{idx + 1} / {total}</span>
        </div>

        {/* deity tabs */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 2px 18px', justifyContent: 'center', flexWrap: 'wrap', animation: 'tvRise .5s .05s both' }}>
          {window.DEITIES.map((d, di) => {
            const active = di === idx;
            return (
              <button key={d.key} onClick={() => goIdx(di)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', cursor: 'pointer',
                border: active ? 'none' : `1px solid ${T.border}`, borderRadius: 999, padding: '11px 20px',
                background: active ? T.orange : T.white, color: active ? '#fff' : T.ink,
                fontFamily: T.sans, fontWeight: 800, fontSize: 15,
                boxShadow: active ? '0 12px 22px -10px rgba(240,86,14,0.6)' : 'none', transition: 'all .2s',
              }}>
                <span>{d.icon}</span>{d.en}
              </button>
            );
          })}
        </div>

        {/* featured verse card */}
        <Card style={{ padding: 'clamp(24px,3vw,40px)', overflow: 'hidden', animation: 'tvRise .5s .12s both' }}>
          <div key={deity} className="tv-shloka-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 36, alignItems: 'center', animation: 'tvRise .45s both' }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(245,182,43,0.16)', borderRadius: 999, padding: '7px 15px', marginBottom: 22 }}>
                <span style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 11.5, letterSpacing: 1.8, textTransform: 'uppercase', color: T.orange, whiteSpace: 'nowrap' }}>Featured verse · {g.label}</span>
              </div>
              {g.lines.map((l, i) => (
                <div key={i} style={{ fontFamily: T.teSerif, fontWeight: 600, fontSize: 'clamp(23px,2.5vw,32px)', color: T.ink, lineHeight: 1.75 }}>{l}</div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 28 }}>
                <button style={{ width: 58, height: 58, borderRadius: '50%', background: T.ink, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 20, boxShadow: '0 14px 26px -12px rgba(58,30,156,0.7)', display: 'grid', placeItems: 'center' }}>▶</button>
                <div>
                  <div style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 19, color: T.ink, whiteSpace: 'nowrap' }}>Listen &amp; Repeat</div>
                  <div style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.inkSoft, whiteSpace: 'nowrap' }}>Slow tempo · {g.dur}</div>
                </div>
              </div>
            </div>
            {/* deity art */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: 'min(330px,72vw)', aspectRatio: '1', borderRadius: 30, overflow: 'hidden',
                background: `radial-gradient(120% 120% at 50% 30%, ${window.DEITY_TINT[deity]}, #16102E)`,
                boxShadow: '0 34px 56px -28px rgba(36,26,85,0.7), 0 0 0 1px rgba(245,182,43,0.25) inset', padding: 9 }}>
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 45%, rgba(246,194,90,0.32), transparent 60%)', animation: 'tvGlow 5s ease-in-out infinite' }} />
                <image-slot id={`deity-${deity}`} style={{ position: 'relative', width: '100%', height: '100%', display: 'block' }}
                  shape="rounded" radius="22" fit="cover" src={window.mandalaDataURI()} placeholder="Drop deity art ✨"></image-slot>
              </div>
            </div>
          </div>

          {/* accordions */}
          <div style={{ marginTop: 34 }}>
            <Accordion title="Telugu Reading" te="తెలుగు చదవడం" open={open === 'te'} onToggle={() => setOpen(open === 'te' ? '' : 'te')}>
              <p style={{ fontFamily: T.teSerif, fontWeight: 400, fontSize: 20, color: T.inkSoft, lineHeight: 1.9, margin: 0 }}>{g.lines.join(' · ')}</p>
            </Accordion>
            <Accordion title="English Pronunciation" open={open === 'en'} onToggle={() => setOpen(open === 'en' ? '' : 'en')}>
              {g.roman.map((r, i) => <div key={i} style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 16, color: T.inkSoft, lineHeight: 1.7 }}>{r}</div>)}
            </Accordion>
            <Accordion title="💡 Meaning" open={open === 'meaning'} onToggle={() => setOpen(open === 'meaning' ? '' : 'meaning')}>
              <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 16.5, color: T.inkSoft, lineHeight: 1.7, margin: 0 }}>{g.meaning}</p>
            </Accordion>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '26px 0 4px', animation: 'tvRise .5s .18s both' }}>
          <Button variant="ghost" onClick={() => goIdx(idx - 1)}>← Prev</Button>
          <Button onClick={() => goIdx(idx + 1)}>Next Shloka →</Button>
        </div>
      </>
    );
  }

  window.Shlokas = Shlokas;
})();
