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
  const isSubitemType = type === 'an' || type === 'match'

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
    socket.emit('start-question', { id: question.id, type, options: question.options, subitems: question.subitems })
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

  function selectSubitemAnswer(profileId, subitemId, option) {
    setSelectedAnswers(prev => ({
      ...prev,
      [profileId]: { ...(prev[profileId] || {}), [subitemId]: option }
    }))
  }

  const allAnswered = profiles.every(p => {
    if (isSubitemType) {
      const ans = selectedAnswers[p.id] || {}
      return question.subitems.every(si => ans[si.id])
    }
    return !!selectedAnswers[p.id]
  })

  const waitingFor = profiles
    .filter(p => {
      if (isSubitemType) {
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
            background: timerColor, transition: 'width 1s linear, background 0.3s', borderRadius: 6
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          color: timerColor, minWidth: 100, textAlign: 'right'
        }}>
          {mins}:{secs}
        </div>
      </div>

      {/* Question card */}
      <div className="card fade-up" style={{ padding: '3% 4%', marginBottom: '2%' }}>
        <div style={{ color: 'var(--muted)', fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', marginBottom: 12 }}>
          {question.emoji} {(question.subject || '').toUpperCase()} · {question.category || ''}
          {type === 'an' && <span style={{ marginLeft: 10, color: 'var(--blue)', fontWeight: 700 }}>ANO / NE</span>}
          {type === 'match' && <span style={{ marginLeft: 10, color: 'var(--gold)', fontWeight: 700 }}>PŘIŘAZOVÁNÍ</span>}
        </div>

        {question.context && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700, marginBottom: 6 }}>📄 Výchozí text:</div>
            <div style={{
              fontSize: '1rem', fontStyle: 'italic',
              background: 'rgba(0,0,0,0.25)',
              borderLeft: '3px solid var(--blue)',
              borderRadius: '0 8px 8px 0',
              padding: '10px 14px',
              maxHeight: '30vh',
              overflowY: 'auto',
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              color: 'var(--text)'
            }}>
              {question.context}
            </div>
          </div>
        )}

        <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.9rem)', fontWeight: 800, lineHeight: 1.4, whiteSpace: 'pre-line' }}>
          {question.question}
        </div>

        {/* Subitems list for AN and match */}
        {isSubitemType && question.subitems && (
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {question.subitems.map((si, idx) => (
              <div key={si.id} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '8px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px solid var(--border)',
                fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)', fontWeight: 600
              }}>
                <div style={{
                  background: 'var(--border)', color: 'var(--text)',
                  fontFamily: 'var(--font-display)',
                  width: 30, height: 30, borderRadius: 7, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem'
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
          padding: '4%', animationDelay: '0.2s'
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
        <div className="fade-up" style={{ flex: 1, display: 'flex', gap: '2%', minHeight: 0 }}>

          {/* Left: options legend (MC + match) */}
          {(type === 'mc' || type === 'match') && (
            <div style={{ flex: type === 'match' ? 0.9 : 1.2, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {type === 'match' && (
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 700, paddingLeft: 4 }}>
                  Možnosti k přiřazení:
                </div>
              )}
              {Object.entries(question.options).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex', gap: 10,
                  padding: type === 'match' ? '10px 14px' : '14px 18px',
                  borderRadius: 12, border: '2px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                  fontSize: type === 'match' ? 'clamp(0.85rem, 1.2vw, 1.1rem)' : 'clamp(1.1rem, 1.6vw, 1.4rem)',
                  fontWeight: 700, alignItems: 'center'
                }}>
                  <div style={{
                    background: 'var(--border)', color: 'var(--text)',
                    fontFamily: 'var(--font-display)',
                    width: type === 'match' ? 32 : 44,
                    height: type === 'match' ? 32 : 44,
                    borderRadius: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: type === 'match' ? '1rem' : '1.4rem'
                  }}>{key}</div>
                  {value}
                </div>
              ))}
            </div>
          )}

          {/* Right: profile selectors */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>

            {/* AN + match: 2-column grid of profile cards */}
            {isSubitemType && (
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 10, overflowY: 'auto', flex: 1, alignContent: 'start'
              }}>
                {profiles.map(p => {
                  const ans = selectedAnswers[p.id] || {}
                  const count = Object.keys(ans).length
                  const total = question.subitems.length
                  const buttons = type === 'an' ? ['A', 'N'] : optionKeys
                  return (
                    <div key={p.id} className="card" style={{ padding: '10px 12px', borderColor: p.color + '33' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: '1.2rem' }}>{p.emoji}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: p.color }}>{p.name}</span>
                        <span style={{
                          marginLeft: 'auto', fontSize: '0.72rem',
                          color: count === total ? 'var(--green)' : 'var(--muted)', fontWeight: 700
                        }}>{count}/{total}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {question.subitems.map((si, idx) => {
                          const chosen = ans[si.id]
                          return (
                            <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <span style={{
                                color: 'var(--muted)', fontSize: '0.78rem',
                                minWidth: 18, textAlign: 'right', flexShrink: 0
                              }}>{idx + 1}.</span>
                              {buttons.map(opt => (
                                <button key={opt} onClick={() => selectSubitemAnswer(p.id, si.id, opt)} style={{
                                  flex: 1, height: 32, borderRadius: 5,
                                  border: '2px solid ' + (chosen === opt ? p.color : 'var(--border)'),
                                  background: chosen === opt ? p.color + '22' : 'transparent',
                                  color: chosen === opt ? p.color : 'var(--muted)',
                                  fontSize: type === 'an' ? '0.75rem' : '0.82rem',
                                  cursor: 'pointer', fontWeight: 800, transition: 'all 0.15s'
                                }}>
                                  {type === 'an' ? (opt === 'A' ? 'ANO' : 'NE') : opt}
                                </button>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* MC: vertical list */}
            {type === 'mc' && profiles.map(p => (
              <div key={p.id} className="card" style={{ padding: '12px 16px', borderColor: p.color + '33' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: p.color }}>{p.name}</span>
                </div>
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
              </div>
            ))}

            <div style={{
              padding: '8px 14px', borderRadius: 10, flexShrink: 0,
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
                flexShrink: 0, fontSize: 'clamp(1rem, 1.6vw, 1.4rem)', padding: '18px',
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
