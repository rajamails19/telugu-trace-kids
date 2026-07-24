// screen-tracing.jsx — working letter-trace canvas
(function () {
  const T = window.T;
  const { useState, useRef, useEffect } = React;

  function TraceCanvas({ letter }) {
    const canvasRef = useRef(null);
    const drawing = useRef(false);
    const [dirty, setDirty] = useState(false);

    function ctxOf() { return canvasRef.current.getContext('2d'); }
    function resize() {
      const c = canvasRef.current; if (!c) return;
      const rect = c.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      c.width = rect.width * dpr; c.height = rect.height * dpr;
      ctxOf().setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    useEffect(() => { resize(); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
    useEffect(() => { clear(); }, [letter]);

    function clear() {
      const c = canvasRef.current; if (!c) return;
      const ctx = ctxOf();
      ctx.clearRect(0, 0, c.width, c.height);
      setDirty(false);
    }
    function pos(e) {
      const r = canvasRef.current.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      return { x: p.clientX - r.left, y: p.clientY - r.top };
    }
    function start(e) { e.preventDefault(); drawing.current = true; const ctx = ctxOf(); const { x, y } = pos(e); ctx.beginPath(); ctx.moveTo(x, y); }
    function move(e) {
      if (!drawing.current) return; e.preventDefault();
      const ctx = ctxOf(); const { x, y } = pos(e);
      ctx.lineTo(x, y); ctx.strokeStyle = T.orange; ctx.lineWidth = 13; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.shadowColor = 'rgba(240,86,14,0.35)'; ctx.shadowBlur = 8; ctx.stroke();
      if (!dirty) setDirty(true);
    }
    function end() { drawing.current = false; }

    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'relative', borderRadius: 28, border: `2.5px dashed rgba(240,86,14,0.4)`,
          background: 'linear-gradient(180deg, rgba(252,230,214,0.5), rgba(255,253,248,0.4))',
          aspectRatio: '1.32', overflow: 'hidden',
        }}>
          {/* guide glyph */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
            <span style={{ fontFamily: T.te, fontWeight: 700, fontSize: 'min(46vw, 280px)', color: 'rgba(240,86,14,0.16)', lineHeight: 1 }}>{letter.g}</span>
          </div>
          <canvas ref={canvasRef} onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
            onTouchStart={start} onTouchMove={move} onTouchEnd={end}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }} />
          <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', fontFamily: T.sans, fontWeight: 800, fontSize: 11.5, letterSpacing: 2.4, textTransform: 'uppercase', color: T.inkSoft, opacity: 0.6, pointerEvents: 'none' }}>
            Trace inside the golden guide
          </div>
        </div>
        <button onClick={clear} style={{ position: 'absolute', top: -64, right: 0, background: T.ink, color: '#fff', border: 'none', borderRadius: 999, padding: '12px 22px', fontFamily: T.sans, fontWeight: 800, fontSize: 14.5, cursor: 'pointer', boxShadow: '0 10px 20px -10px rgba(58,30,156,0.6)' }}>↺ Reset</button>
      </div>
    );
  }

  function Tracing({ go }) {
    const { Eyebrow, Card, Button } = window;
    const [sel, setSel] = useState(0);
    const letter = window.VOWELS[sel];
    const [toast, setToast] = useState(false);
    function check() { setToast(true); setTimeout(() => setToast(false), 1900); }

    return (
      <>
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Practice</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>Letter Tracing</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>Follow the golden guide. Lift, breathe, trace — your stroke becomes the letter.</p>
        </div>

        <div className="tv-trace-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start', paddingBottom: 10 }}>
          {/* letter picker */}
          <Card style={{ padding: 22, animation: 'tvRise .5s .05s both' }}>
            <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: T.orange, marginBottom: 16 }}>
              Vowels · <span style={{ fontFamily: T.te }}>అచ్చులు</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {window.VOWELS.map((v, i) => {
                const active = i === sel;
                return (
                  <button key={v.g} onClick={() => setSel(i)} style={{
                    aspectRatio: '1', borderRadius: 18, cursor: 'pointer', border: 'none',
                    background: active ? T.orange : '#FCEFE0',
                    color: active ? '#fff' : T.ink, fontFamily: T.te, fontWeight: 700, fontSize: 26,
                    boxShadow: active ? '0 10px 20px -8px rgba(240,86,14,0.6)' : 'none',
                    transition: 'transform .15s, background .2s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#FBE3CF'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#FCEFE0'; }}
                  >{v.g}</button>
                );
              })}
            </div>
          </Card>

          {/* canvas card */}
          <Card style={{ padding: 28, position: 'relative', overflow: 'visible', animation: 'tvRise .5s .12s both' }}>
            <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: T.orange }}>Now tracing</div>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 30, color: T.ink, margin: '6px 0 22px' }}>
              Letter <span style={{ fontFamily: T.te }}>{letter.g}</span> <span style={{ fontFamily: T.sans, fontSize: 17, fontWeight: 700, color: T.inkSoft }}>· {letter.r}</span>
            </h2>
            <TraceCanvas letter={letter} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
              <Button onClick={check}>✓ Check stroke</Button>
              <Button variant="ghost">▶ Hear letter</Button>
              <Button variant="ghost">Show stroke order</Button>
            </div>
            {toast && (
              <div style={{ position: 'absolute', top: 18, right: 18, background: '#2E9E5B', color: '#fff', fontFamily: T.sans, fontWeight: 800, fontSize: 14.5, padding: '12px 18px', borderRadius: 14, boxShadow: '0 14px 26px -12px rgba(46,158,91,0.7)', animation: 'tvPop .3s both' }}>
                ✦ Beautiful! +5 stars
              </div>
            )}
          </Card>
        </div>
      </>
    );
  }

  window.Tracing = Tracing;
})();
