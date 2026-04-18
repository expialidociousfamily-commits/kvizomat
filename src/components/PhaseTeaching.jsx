import { useEffect, useRef } from 'react'

export default function PhaseTeaching({ question, explanation, loading, onContinue, onSimpler }) {
  const textRef = useRef()

  // Simple markdown-ish renderer
  function renderText(text) {
    if (!text) return null
    return text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 900, color: 'var(--gold)', fontSize: '1.15em', marginTop: 12 }}>{line.replace(/\*\*/g, '')}</div>
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} style={{ paddingLeft: 16, margin: '4px 0', lineHeight: 1.6 }}>{line}</div>
      }
      if (line.startsWith('*') && line.endsWith('*')) {
        return <div key={i} style={{ color: 'var(--muted)', fontStyle: 'italic', fontSize: '0.9em' }}>{line.replace(/\*/g, '')}</div>
      }
      return <div key={i} style={{ margin: '4px 0', lineHeight: 1.7 }}>{line}</div>
    })
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '3% 6%'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '3%' }}>
        <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>🎓</div>
        <div>
          <div className="display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: 'var(--blue)' }}>
            NEJDŘÍV SE NAUČÍME
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)' }}>
            {question.emoji} {question.subject} · {question.category}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="card scrollable fade-up" style={{
        flex: 1,
        padding: '4% 5%',
        fontSize: 'clamp(1.1rem, 1.8vw, 1.55rem)',
        lineHeight: 1.7,
        position: 'relative'
      }}>
        {loading ? (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 24, color: 'var(--muted)'
          }}>
            <div style={{
              width: 56, height: 56,
              border: '4px solid var(--border)',
              borderTopColor: 'var(--gold)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <div style={{ fontSize: '1.3rem' }}>Kvízomat připravuje výuku...</div>
          </div>
        ) : (
          <div ref={textRef}>{renderText(explanation)}</div>
        )}
      </div>

      {/* Buttons */}
      {!loading && (
        <div className="fade-up" style={{
          display: 'flex', justifyContent: 'center', gap: 24,
          marginTop: '3%', animationDelay: '0.3s'
        }}>
          <button className="btn btn-ghost" onClick={onSimpler} style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.3rem)',
            padding: '18px 36px'
          }}>
            🔄 Zkus to jednodušeji
          </button>
          <button className="btn btn-gold" onClick={onContinue} style={{
            fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
            padding: '20px 56px'
          }}>
            Rozumíme, jdeme na to! ✅
          </button>
        </div>
      )}
    </div>
  )
}
