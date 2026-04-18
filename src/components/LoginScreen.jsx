import { useState } from 'react'

export default function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    if (password === 'joujou') {
      onLogin()
    } else {
      setError('Špatné heslo 🙈')
      setPassword('')
    }
  }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 24, padding: 32
    }}>
      <div style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>🎓</div>
      <div className="display" style={{
        fontSize: 'clamp(2.5rem, 7vw, 5rem)',
        color: 'var(--gold)', lineHeight: 1, textAlign: 'center'
      }}>
        KVÍZOMAT
      </div>
      <div style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 2vw, 1.4rem)', textAlign: 'center' }}>
        Rodinná příprava na přijímačky
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 16 }}>
        <input
          type="password"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Heslo..."
          autoFocus
          style={{
            background: 'var(--surface)',
            border: '2px solid ' + (error ? '#f87171' : 'var(--border)'),
            borderRadius: 14, padding: '16px 28px',
            color: 'var(--text)', fontSize: '1.4rem',
            textAlign: 'center', width: 220, outline: 'none',
            fontFamily: 'var(--font-body)', letterSpacing: 6,
            transition: 'border-color 0.2s'
          }}
        />
        {error && (
          <div style={{ color: '#f87171', fontSize: '1rem', fontWeight: 700 }}>{error}</div>
        )}
        <button
          className="btn btn-gold"
          onClick={handleSubmit}
          style={{ fontSize: '1.2rem', padding: '16px 48px', marginTop: 4 }}
        >
          Vstoupit →
        </button>
      </div>
    </div>
  )
}
