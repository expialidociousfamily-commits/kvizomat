export default function SessionSummary({ question, answers, profiles, streak, onHome }) {
  const correct = question.correct_option
  const winners = profiles.filter(p => answers[p.id] === correct)
  const earned = winners.map(p => ({ ...p, pts: 10 }))

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '5%', gap: '3%'
    }}>
      {/* Big celebration */}
      <div style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', animation: 'pop 0.5s ease both' }}>
        {winners.length === profiles.length ? '🎉' : winners.length > 0 ? '👍' : '💪'}
      </div>

      <div className="display fade-up" style={{
        fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
        color: 'var(--gold)', textAlign: 'center',
        animationDelay: '0.1s'
      }}>
        {winners.length === profiles.length ? 'SKVĚLÁ PRÁCE!' : winners.length > 0 ? 'DOBRÁ PRÁCE!' : 'NEVZDÁVEJTE TO!'}
      </div>

      <div className="fade-up" style={{
        color: 'var(--muted)', fontSize: 'clamp(1rem, 1.8vw, 1.5rem)',
        textAlign: 'center', animationDelay: '0.2s'
      }}>
        {winners.length === profiles.length
          ? 'Všichni odpověděli správně! Parádní tým!'
          : winners.length > 0
          ? `${winners.map(p => p.name).join(' a ')} to zvládl/a!`
          : 'Zítra to vyjde — uvidíte tutéž otázku znovu 🔄'}
      </div>

      {/* Streak */}
      <div className="card fade-up pop" style={{
        padding: '24px 48px', textAlign: 'center',
        borderColor: 'var(--gold) 44',
        animationDelay: '0.3s'
      }}>
        <div style={{ fontSize: '3rem' }}>🔥</div>
        <div className="display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--gold)' }}>{streak}</div>
        <div style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>dní v řadě</div>
      </div>

      {/* Points gained */}
      {earned.length > 0 && (
        <div className="fade-up" style={{
          display: 'flex', gap: 16, animationDelay: '0.4s'
        }}>
          {earned.map(p => (
            <div key={p.id} style={{
              textAlign: 'center', padding: '12px 20px',
              background: 'rgba(245,197,24,0.1)',
              border: '1px solid var(--gold) 44',
              borderRadius: 14
            }}>
              <div style={{ fontSize: '1.8rem' }}>{p.emoji}</div>
              <div style={{ fontWeight: 800 }}>{p.name}</div>
              <div style={{ color: 'var(--gold)', fontWeight: 900, fontSize: '1.3rem' }}>+{p.pts} ⭐</div>
            </div>
          ))}
        </div>
      )}

      <button className="btn btn-gold fade-up" onClick={onHome} style={{
        fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
        padding: '22px 60px',
        marginTop: 8,
        animationDelay: '0.5s'
      }}>
        🏠 Domů
      </button>
    </div>
  )
}
