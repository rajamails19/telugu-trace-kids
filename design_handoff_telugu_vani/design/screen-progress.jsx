// screen-progress.jsx
(function () {
  const T = window.T;

  function StatCard({ icon, n, label, i }) {
    const { Card } = window;
    return (
      <Card style={{ padding: 24, animation: `tvRise .5s ${0.06 * i}s both` }}>
        <div style={{ fontSize: 26, marginBottom: 14 }}>{icon}</div>
        <div style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 42, color: T.ink, lineHeight: 1 }}>{n}</div>
        <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft, marginTop: 10 }}>{label}</div>
      </Card>
    );
  }

  function Progress({ go }) {
    const { Eyebrow, Card } = window;
    return (
      <>
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Your journey</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>Progress</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>Tiny daily steps. Beautiful, lifelong fluency.</p>
        </div>

        <div className="tv-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {window.STATS.map((s, i) => <StatCard key={i} {...s} i={i} />)}
        </div>

        <Card style={{ padding: 'clamp(26px,3vw,40px)', marginTop: 28, animation: 'tvRise .5s .2s both' }}>
          <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 28, color: T.ink, margin: '0 0 22px' }}>Milestones</h2>
          <div style={{ position: 'relative' }}>
            {window.MILESTONES.map((m, i) => {
              const last = i === window.MILESTONES.length - 1;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '14px 0', position: 'relative' }}>
                  <div style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%',
                      background: m.done ? T.orange : '#FCEodd'.replace('#FCEodd', '#FBE3CF'),
                      border: m.done ? 'none' : `2px solid ${T.peach}`,
                      display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>
                      {m.done ? '✓' : ''}
                    </div>
                    {!last && <div style={{ position: 'absolute', left: 12, top: 26, width: 2, height: 30, background: m.done ? 'rgba(240,86,14,0.35)' : T.peach }} />}
                  </div>
                  <div style={{ flex: 1, fontFamily: T.serif, fontWeight: 700, fontSize: 19, color: m.done ? T.ink : T.inkSoft }}>{m.t}</div>
                  <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft }}>{m.when}</div>
                </div>
              );
            })}
          </div>
        </Card>
      </>
    );
  }

  window.Progress = Progress;
})();
