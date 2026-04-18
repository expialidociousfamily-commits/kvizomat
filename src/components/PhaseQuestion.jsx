import { useState, useEffect, useRef } from 'react'
import { io as connectSocket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
const TIMER_SECONDS = 120 // 2 minutes

export default function PhaseQuestion({ question, profiles, onSubmitAnswers }) {
  const [stage, setStage] = useState('thinking') // thinking | answering | done
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [mobileJoinUrl, setMobileJoinUrl] = useState(`${SOCKET_URL}/join`)
  const socketRef = useRef(null)

  useEffect(() => {
    if (stage !== 'thinking') return
    if (timeLeft <= 0) {
      setStage('answering')
      return
    }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [stage, timeLeft])

  useEffect(() => {
    if (stage !== 'answering') return
    const socket = connectSocket(SOCKET_URL)
    socketRef.current = socket
    socket.emit('start-question', { id: question.id, options: question.options })
    socket.on('answer-received', ({ profileId, answer }) => {
      setSelectedAnswers(prev => ({ ...prev, [profileId]: answer }))
    })
    fetch(`${SOCKET_URL}/ip`)
      .then(r => r.json())
      .then(d => setMobileJoinUrl(`${d.url}/join`))
      .catch(() => {})
    return () => {
      socket.emit('end-question')
      socket.disconnect()
    }
  }, [stage])

  const pct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft > 30 ? 'var(--green)' : timeLeft > 10 ? 'var(--gold)' : 'var(--red)'
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  function selectAnswer(profileId, option) {
    setSelectedAnswers(prev => ({ ...prev, [profileId]: option }))
  }

  function handleSubmit() {
    onSubmitAnswers(selectedAnswers)
  }

  const allAnswered = profiles.every(p => selectedAnswers[p.id])

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '2% 5%' }}>

      {/* Timer bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '2%' }}>
        <div style={{
          flex: 1, height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: timerColor,
            transition: 'width 1s linear, background 0.3s',
            borderRadius: 6
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: timerColor, minWidth: 100, textAlign: 'right'
        }}>
          {mins}:{secs}
        </div>
      </div>

      {/* Question */}
      <div className="card fade-up" style={{ padding: '4% 5%', marginBottom: '2%' }}>
        <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', marginBottom: 16 }}>
          {question.emoji} {question.subject.toUpperCase()} · {question.category}
        </div>
        <div style={{
          fontSize: 'clamp(1.3rem, 2.5vw, 2.2rem)',
          fontWeight: 800,
          lineHeight: 1.5,
          whiteSpace: 'pre-line'
        }}>
          {question.question}
        </div>
      </div>

      {/* Thinking phase overlay */}
      {stage === 'thinking' && (
        <div className="card fade-up" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          borderColor: 'var(--blue) 44', padding: '4%',
          animationDelay: '0.2s'
        }}>
          <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>✏️</div>
          <div style={{
            fontSize: 'clamp(1.3rem, 2.2vw, 2rem)',
            fontWeight: 800, textAlign: 'center'
          }}>
            Napište odpověď na papír!
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', textAlign: 'center' }}>
            Každý sám, bez dívání na ostatní 🙈
          </div>
          <button className="btn btn-gold" onClick={() => setStage('answering')} style={{
            fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)',
            padding: '20px 52px',
            marginTop: 16
          }}>
            Mám napsáno! Ukažte možnosti →
          </button>
        </div>
      )}

      {/* Answering phase */}
      {stage === 'answering' && (
        <div className="fade-up" style={{ flex: 1, display: 'flex', gap: '2%' }}>
          {/* Options */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(question.options).map(([key, value]) => (
              <div key={key} style={{
                display: 'flex',
                gap: 12,
                padding: '16px 20px',
                borderRadius: 14,
                border: '2px solid var(--border)',
                background: 'rgba(255,255,255,0.02)',
                fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)',
                fontWeight: 700,
                alignItems: 'center'
              }}>
                <div className="option-key" style={{
                  background: 'var(--border)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  width: 44, height: 44, borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>{key}</div>
                {value}
              </div>
            ))}
          </div>

          {/* Profile selectors */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profiles.map(p => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', borderColor: p.color + '33' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: p.color }}>{p.name}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['A','B','C','D'].map(opt => (
                    <button key={opt} onClick={() => selectAnswer(p.id, opt)} style={{
                      flex: 1, padding: '10px 4px',
                      borderRadius: 10,
                      border: '2px solid ' + (selectedAnswers[p.id] === opt ? p.color : 'var(--border)'),
                      background: selectedAnswers[p.id] === opt ? p.color + '22' : 'transparent',
                      color: selectedAnswers[p.id] === opt ? p.color : 'var(--muted)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.3rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontWeight: 700
                    }}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{
              padding: '8px 14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--muted)', fontSize: '0.82rem', textAlign: 'center'
            }}>
              📱 Mobily: <strong style={{ color: 'var(--text)' }}>{mobileJoinUrl}</strong>
            </div>

            <button
              className="btn btn-gold"
              onClick={handleSubmit}
              disabled={!allAnswered}
              style={{
                marginTop: 8,
                fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
                padding: '18px',
                opacity: allAnswered ? 1 : 0.4,
                cursor: allAnswered ? 'pointer' : 'not-allowed'
              }}
            >
              {allAnswered ? '🎬 Odhalit výsledky!' : `⏳ Čekáme na ${profiles.filter(p => !selectedAnswers[p.id]).map(p => p.name).join(', ')}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
