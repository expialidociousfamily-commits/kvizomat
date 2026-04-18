import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

export default function HomeScreen({ streak, points, stats, profiles, onStart, onParent }) {
  const today = new Date().toLocaleDateString('cs-CZ', { weekday: 'long', day: 'numeric', month: 'long' })
  const totalPoints = Object.values(points).reduce((a, b) => a + b, 0)

  function handleStart() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {})
    }
    onStart()
  }

  const [qrDataUrl, setQrDataUrl] = useState('')
  const mobileUrl = `http://${window.location.hostname}:3001/join`

  useEffect(() => {
    QRCode.toDataURL(mobileUrl, { width: 96, margin: 1, color: { dark: '#ffffff', light: '#070b14' } })
      .then(setQrDataUrl)
      .catch(() => {})
  }, [mobileUrl])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      padding: '3% 5%',
      position: 'relative'
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4%' }}>
        <div>
          <div className="display" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: 'var(--gold)', lineHeight: 1 }}>
            KVÍZOMAT
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.9rem, 1.6vw, 1.4rem)', marginTop: 4, textTransform: 'capitalize' }}>
            {today}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Streak */}
          <div className="card" style={{ padding: '16px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>🔥</div>
            <div className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: 'var(--gold)', lineHeight: 1 }}>{streak}</div>
            <div style={{ color: 'var(--muted)', fontSize: '1rem' }}>dní v řadě</div>
          </div>
          {/* Total points */}
          <div className="card" style={{ padding: '16px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>⭐</div>
            <div className="display" style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: 'var(--gold)', lineHeight: 1 }}>{totalPoints}</div>
            <div style={{ color: 'var(--muted)', fontSize: '1rem' }}>bodů celkem</div>
          </div>
          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="btn btn-ghost"
            style={{
              padding: '12px 16px',
              fontSize: '1.8rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer'
            }}
            title="Přepnout na celou obrazovku"
          >
            ⛶
          </button>
        </div>
      </div>

      {/* Profiles */}
      <div style={{ display: 'flex', gap: '2%', marginBottom: '4%' }}>
        {profiles.map(p => {
          const s = stats?.[p.id] || { answered: 0, pct: null }
          return (
            <div key={p.id} className="card" style={{
              flex: 1, padding: '3% 2%', textAlign: 'center',
              borderColor: p.color + '44'
            }}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{p.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: 'clamp(1rem, 1.8vw, 1.6rem)', marginTop: 8 }}>{p.name}</div>
              <div className="display" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', color: p.color }}>
                🎯 {s.pct !== null ? `${s.pct} %` : '—'}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>✅ {s.answered} otázek</div>
              <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>🔥 {streak} série</div>
            </div>
          )
        })}
      </div>

      {/* CTA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <div style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 1.8vw, 1.5rem)' }}>
          Připraveni na dnešní výzvu?
        </div>
        <button
          className="btn btn-gold"
          onClick={handleStart}
          style={{
            fontSize: 'clamp(1.4rem, 2.8vw, 2.5rem)',
            padding: '24px 72px',
            animation: 'pulse-gold 2s ease-in-out infinite'
          }}
        >
          🚀 SPUSTIT SESSION
        </button>
      </div>

      {/* Mobile QR */}
      {qrDataUrl && (
        <div style={{
          position: 'absolute', bottom: 20, left: 28,
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)', borderRadius: 12,
          padding: '8px 12px'
        }}>
          <img src={qrDataUrl} alt="QR" style={{ width: 64, height: 64, borderRadius: 6 }} />
          <div>
            <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>📱 Mobilní odpovídání</div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{window.location.hostname}:3001/join</div>
          </div>
        </div>
      )}

      {/* Parent button */}
      <button
        className="btn btn-ghost"
        onClick={onParent}
        style={{ position: 'absolute', bottom: 24, right: 32, fontSize: '1rem', padding: '10px 20px' }}
      >
        ⚙️ Správa otázek
      </button>
    </div>
  )
}
