import { useState, useEffect, useRef } from 'react'
import { io as connectSocket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
const TIMER_SECONDS = 120

export default function PhaseQuestion({ question, profiles, onSubmitAnswers }) {
  const [stage, setStage] = useState('thinking') // thinking | answering | done
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const mobileJoinUrl = window.location.origin + '/join'
  const socketRef = useRef(null)

  const type = question.type || 'mc'
  const optionKeys = question.options ? Object.keys(question.options) : []

  useEffect(() => {
    if (stage !== 'thinking') return
    if (timeLeft <= 0) { setStage('answering'); return }
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
    return () => { socket.emit('end-question'); socket.disconnect() }
  }, [stage])

  const pct = (timeLeft / TIMER_SECONDS) * 100
  const timerColor = timeLeft > 30 ? 'var(--green)' : timeLeft > 10 ? 'var(--gold)' : 'var(--red)'
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  function selectMcAnswer(profileId, option) {
    setSelectedAnswers(prev => ({ ...prev, [profileId]: option }))
  }

  function selectAnAnswer(profileId, subitemId, option) {
    setSelectedAnswers(prev => ({
      ...prev,
      [profileId]: { ...(prev[profileId] || {}), [subitemId]: option }
    }))
  }

  function profileAnsweredCount(profileId) {
    if (type !== 'an') return null
    const ans = selectedAnswers[profileId] || {}
    return Object.keys(ans).length
  }

  const allAnswered = profiles.every(p => {
    if (type === 'an') {
      const ans = selectedAnswers[p.id] || {}
      return question.subitems.every(si => ans[si.id])
    }
    return !!selectedAnswers[p.id]
  })

  const waitingFor = profiles
    .filter(p => {
      if (type === 'an') {
        const ans = selectedAnswers[p.id] || {}
        return !question.subitems.every(si => ans[si.id])
      }
      return !selectedAnswers[p.id]
    })
    .map(p => p.name)

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '2% 5%' }}>

      {/* Timer bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: '2%' }}>
        <div style={{ flex: 1, height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}>
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

      {/* Question card */}
      <div className="card fade-up" style={{ padding: '4% 5%', marginBottom: '2%' }}>
        <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', marginBottom: 16 }}>
          {question.emoji} {question.subject.toUpperCase()} · {question.category}
          {type === 'an' && <span style={{ marginLeft: 10, color: 'var(--blue)', fontWeight: 700 }}>ANO / NE</span>}
          {type === 'match' && <span style={{ marginLeft: 10, color: 'var(--gold)', fontWeight: 700 }}>PŘIŘAZOVÁNÍ</span>}
        </div>
        <div style={{
          fontSize: 'clamp(1.3rem, 2.5vw, 2.2rem)',
          fontWeight: 800, lineHeight: 1.5, whiteSpace: 'pre-line'
        }}>
          {question.question}
        </div>

        {/* AN: subitems list in question card */}
        {type === 'an' && question.subitems && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.subitems.map((si, idx) => (
              <div key={si.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid var(--border)',
                fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', fontWeight: 600
              }}>
                <div style={{
                  background: 'var(--border)', color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>{idx + 1}</div>
                {si.question}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thinking phase */}
      {stage === 'thinking' && (
        <div className="card fade-up" style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 24,
          borderColor: 'var(--blue) 44', padding: '4%',
          animationDelay: '0.2s'
        }}>
          <div style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}>✏️</div>
          <div style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)', fontWeight: 800, textAlign: 'center' }}>
            Napište odpověď na papír!
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', textAlign: 'center' }}>
            Každý sám, bez dívání na ostatní 🙈
          </div>
          <button className="btn btn-gold" onClick={() => setStage('answering')} style={{
            fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)', padding: '20px 52px', marginTop: 16
          }}>
            Mám napsáno! Ukažte možnosti →
          </button>
        </div>
      )}

      {/* Answering phase */}
      {stage === 'answering' && (
        <div className="fade-up" style={{ flex: 1, display: 'flex', gap: '2%' }}>

          {/* Left: options panel (MC / match only) */}
          {(type === 'mc' || type === 'match') && (
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(question.options).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex', gap: 12, padding: '16px 20px', borderRadius: 14,
                  border: '2px solid var(--border)', background: 'rgba(255,255,255,0.02)',
                  fontSize: 'clamp(1.1rem, 1.6vw, 1.4rem)', fontWeight: 700, alignItems: 'center'
                }}>
                  <div style={{
                    background: 'var(--border)', color: 'var(--text)',
                    fontFamily: 'var(--font-display)', fontSize: '1.4rem',
                    width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>{key}</div>
                  {value}
                </div>
              ))}
            </div>
          )}

          {/* Right: profile selectors */}
          <div style={{ flex: type === 'an' ? 2 : 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {profiles.map(p => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', borderColor: p.color + '33' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: p.color }}>{p.name}</span>
                  {type === 'an' && (
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--muted)',
                      background: 'rgba(255,255,255,0.06)', borderRadius: 6, padding: '2px 8px'
                    }}>
                      {profileAnsweredCount(p.id)}/{question.subitems.length} zodpovězeno
                    </span>
                  )}
                </div>

                {/* MC / match: dynamic option buttons */}
                {(type === 'mc' || type === 'match') && (
                  <div style={{ display: 'flex', gap: 8 }}>
                    {optionKeys.map(opt => (
                      <button key={opt} onClick={() => selectMcAnswer(p.id, opt)} style={{
                        flex: 1, padding: '10px 4px', borderRadius: 10,
                        border: '2px solid ' + (selectedAnswers[p.id] === opt ? p.color : 'var(--border)'),
                        background: selectedAnswers[p.id] === opt ? p.color + '22' : 'transparent',
                        color: selectedAnswers[p.id] === opt ? p.color : 'var(--muted)',
                        fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                        cursor: 'pointer', transition: 'all 0.15s', fontWeight: 700
                      }}>{opt}</button>
                    ))}
                  </div>
                )}

                {/* AN: per-subitem A/N buttons */}
                {type === 'an' && question.subitems && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {question.subitems.map((si, idx) => {
                      const profileAns = selectedAnswers[p.id] || {}
                      const chosen = profileAns[si.id]
                      return (
                        <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            color: 'var(--muted)', fontSize: '0.85rem',
                            fontWeight: 700, minWidth: 18, textAlign: 'right'
                          }}>{idx + 1}.</span>
                          <button onClick={() => selectAnAnswer(p.id, si.id, 'A')} style={{
                            flex: 1, padding: '7px 4px', borderRadius: 8,
                            border: '2px solid ' + (chosen === 'A' ? p.color : 'var(--border)'),
                            background: chosen === 'A' ? p.color + '22' : 'transparent',
                            color: chosen === 'A' ? p.color : 'var(--muted)',
                            fontFamily: 'var(--font-display)', fontSize: '1rem',
                            cursor: 'pointer', transition: 'all 0.15s', fontWeight: 700
                          }}>A ano</button>
                          <button onClick={() => selectAnAnswer(p.id, si.id, 'N')} style={{
                            flex: 1, padding: '7px 4px', borderRadius: 8,
                            border: '2px solid ' + (chosen === 'N' ? p.color : 'var(--border)'),
                            background: chosen === 'N' ? p.color + '22' : 'transparent',
                            color: chosen === 'N' ? p.color : 'var(--muted)',
                            fontFamily: 'var(--font-display)', fontSize: '1rem',
                            cursor: 'pointer', transition: 'all 0.15s', fontWeight: 700
                          }}>N ne</button>
                        </div>
                      )
                    })}
                  </div>
                )}
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
              onClick={() => onSubmitAnswers(selectedAnswers)}
              disabled={!allAnswered}
              style={{
                marginTop: 8, fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', padding: '18px',
                opacity: allAnswered ? 1 : 0.4,
                cursor: allAnswered ? 'pointer' : 'not-allowed'
              }}
            >
              {allAnswered
                ? '🎬 Odhalit výsledky!'
                : `⏳ Čekáme na ${waitingFor.join(', ')}`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
