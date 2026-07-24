// screen-admin.jsx
(function () {
  const T = window.T;

  function Admin({ go }) {
    const { Eyebrow, Card, Button } = window;
    const tiles = [
      { n: '3', label: 'Active learners' },
      { n: '42', label: 'Sessions this week' },
      { n: '92%', label: 'Avg. accuracy' },
    ];
    return (
      <>
        <div style={{ textAlign: 'center', padding: '34px 0 30px', animation: 'tvRise .5s both' }}>
          <Eyebrow style={{ justifyContent: 'center', display: 'flex' }}>Dashboard</Eyebrow>
          <h1 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 'clamp(38px,5vw,60px)', color: T.ink, margin: '10px 0 12px', lineHeight: 1 }}>Admin</h1>
          <p style={{ fontFamily: T.sans, fontWeight: 500, fontSize: 18, color: T.inkSoft, margin: 0 }}>A quiet workspace to shepherd your young learners.</p>
        </div>

        <div className="tv-stats3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {tiles.map((t, i) => (
            <Card key={i} style={{ padding: 26, animation: `tvRise .5s ${0.06 * i}s both` }}>
              <div style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 44, color: T.ink, lineHeight: 1 }}>{t.n}</div>
              <div style={{ fontFamily: T.sans, fontWeight: 800, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color: T.inkSoft, marginTop: 10 }}>{t.label}</div>
            </Card>
          ))}
        </div>

        <Card style={{ padding: 'clamp(24px,3vw,36px)', marginTop: 28, animation: 'tvRise .5s .2s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <h2 style={{ fontFamily: T.serif, fontWeight: 800, fontSize: 28, color: T.ink, margin: 0 }}>Learners</h2>
            <Button style={{ padding: '12px 20px', fontSize: 14.5 }}>+ Add learner</Button>
          </div>
          <div>
            {window.LEARNERS.map((l, i) => (
              <div key={i} className="tv-learner" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', alignItems: 'center', gap: 14, padding: '20px 6px', borderTop: `1px solid ${T.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 40, height: 40, borderRadius: '50%', border: `2.5px solid ${T.gold}`, background: '#FFF6E2', display: 'grid', placeItems: 'center', fontFamily: T.sans, fontWeight: 800, fontSize: 15, color: T.orange }}>{l.initial}</span>
                  <span style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 20, color: T.ink, whiteSpace: 'nowrap' }}>{l.name}</span>
                </div>
                <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.inkSoft }}>🔥 <b style={{ color: T.ink }}>{l.streak}</b> day streak</span>
                <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.inkSoft }}>✍️ {l.letters} letters</span>
                <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.inkSoft }}>🕉️ {l.shlokas} shlokas</span>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  }

  window.Admin = Admin;
})();
