import { useState, useEffect } from 'react'

export default function PhaseReveal({ question, answers, profiles, onContinue }) {
  const [step, setStep] = useState('reveal') // reveal | explain
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 400)
    return () => clearTimeout(t)
  }, [])

  const type = question.type || 'mc'

  function getResult(profileId) {
    if (type === 'an') {
      const ans = answers[profileId] || {}
      return question.subitems.every(si => ans[si.id] === si.correct_option)
    }
    return answers[profileId] === question.correct_option
  }

  function getAnScore(profileId) {
    if (type !== 'an') return null
    const ans = answers[profileId] || {}
    const correct = question.subitems.filter(si => ans[si.id] === si.correct_option).length
    return { correct, total: question.subitems.length }
  }

  const winners = profiles.filter(p => getResult(p.id))
  const allCorrect = winners.length === profiles.length
  const noneCorrect = winners.length === 0

  const correct = question.correct_option

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '3% 5%' }}>

      {step === 'reveal' && (
        <>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '3%' }}>
            <div className="display" style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: allCorrect ? 'var(--green)' : noneCorrect ? 'var(--red)' : 'var(--gold)'
            }}>
              {allCorrect ? '🎉 VŠICHNI SPRÁVNĚ!' : noneCorrect ? '😬 ZKUSTE ZNOVU ZÍTRA' : '📊 VÝSLEDKY'}
            </div>
          </div>

          {/* Correct answer reveal */}
          {shown && (
            <div className="card pop" style={{
              padding: '3% 4%', marginBottom: '3%',
              borderColor: 'var(--green)',
              background: 'rgba(34,197,94,0.07)',
              textAlign: type === 'mc' || type === 'match' ? 'center' : 'left'
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: 12 }}>Správná odpověď</div>

              {/* MC / match: single option badge */}
              {(type === 'mc' || type === 'match') && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: 'var(--green)', color: '#000',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '2rem'
                  }}>{correct}</div>
                  <div style={{ fontSize: 'clamp(1.3rem, 2.2vw, 2rem)', fontWeight: 800 }}>
                    {question.options[correct]}
                  </div>
                </div>
              )}

              {/* AN: subitems with correct A/N */}
              {type === 'an' && question.subitems && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {question.subitems.map((si, idx) => (
                    <div key={si.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)'
                    }}>
                      <span style={{
                        color: 'var(--muted)', fontWeight: 700, minWidth: 20, fontSize: '0.9rem'
                      }}>{idx + 1}.</span>
                      <span style={{ flex: 1, fontSize: 'clamp(0.9rem, 1.3vw, 1.1rem)', fontWeight: 600 }}>
                        {si.question}
                      </span>
                      <div style={{
                        padding: '4px 14px', borderRadius: 8, flexShrink: 0,
                        background: si.correct_option === 'A' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
                        color: si.correct_option === 'A' ? 'var(--green)' : 'var(--red)',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem'
                      }}>
                        {si.correct_option === 'A' ? 'ANO' : 'NE'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile results */}
          <div style={{ display: 'flex', gap: '2%', marginBottom: '3%' }}>
            {profiles.map((p, i) => {
              const ok = getResult(p.id)
              const ans = answers[p.id]
              const score = getAnScore(p.id)
              return (
                <div key={p.id} className="card pop" style={{
                  flex: 1, padding: '3% 2%', textAlign: 'center',
                  borderColor: ok ? 'var(--green)' : 'var(--red)',
                  background: ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                  animationDelay: `${0.2 + i * 0.1}s`
                }}>
                  <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', margin: '8px 0' }}>{p.name}</div>
                  <div style={{ fontSize: '2.5rem' }}>{ok ? '✅' : '❌'}</div>
                  <div style={{ fontSize: '1rem', marginTop: 8, color: ok ? 'var(--green)' : 'var(--red)' }}>
                    {type === 'an' && score !== null
                      ? `${score.correct}/${score.total} správně`
                      : ans ? `Odpověděl/a: ${ans}` : 'Bez odpovědi'
                    }
                    {ok && <div style={{ color: 'var(--gold)', fontWeight: 800 }}>+10 bodů</div>}
                  </div>

                  {/* AN: per-subitem mini breakdown */}
                  {type === 'an' && question.subitems && !ok && ans && (
                    <div style={{ marginTop: 10, display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {question.subitems.map((si, idx) => {
                        const profileAns = (answers[p.id] || {})[si.id]
                        const subOk = profileAns === si.correct_option
                        return (
                          <div key={si.id} style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: subOk ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                            color: subOk ? 'var(--green)' : 'var(--red)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 800
                          }} title={`${idx + 1}. ${si.question}`}>
                            {idx + 1}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <button className="btn btn-ghost" onClick={() => setStep('explain')} style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.3rem)', padding: '18px 36px'
            }}>
              💡 Ukázat vysvětlení
            </button>
            <button className="btn btn-gold" onClick={onContinue} style={{
              fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)', padding: '20px 52px'
            }}>
              Pokračovat →
            </button>
          </div>
        </>
      )}

      {step === 'explain' && (
        <>
          <div style={{ marginBottom: '2%' }}>
            <div className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--blue)' }}>
              💡 PROČ JE TO TAK?
            </div>
          </div>

          <div className="card scrollable fade-up" style={{
            flex: 1, padding: '4% 5%',
            fontSize: 'clamp(1.1rem, 1.7vw, 1.5rem)',
            lineHeight: 1.7,
            marginBottom: '2%'
          }}>
            {/* MC / match: show correct option header */}
            {(type === 'mc' || type === 'match') && (
              <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 16, fontSize: '1.15em' }}>
                Správná odpověď: {correct} — {question.options[correct]}
              </div>
            )}

            {/* AN: compact subitem summary in explain */}
            {type === 'an' && question.subitems && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 10, fontSize: '1.05em' }}>
                  Správné odpovědi:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {question.subitems.map((si, idx) => (
                    <div key={si.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.95em' }}>
                      <span style={{ color: 'var(--muted)', minWidth: 20 }}>{idx + 1}.</span>
                      <span style={{ flex: 1 }}>{si.question}</span>
                      <span style={{
                        padding: '2px 10px', borderRadius: 6, fontWeight: 800,
                        background: si.correct_option === 'A' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        color: si.correct_option === 'A' ? 'var(--green)' : 'var(--red)',
                        fontSize: '0.85em'
                      }}>{si.correct_option === 'A' ? 'ANO' : 'NE'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ whiteSpace: 'pre-line' }}>{question.answer_explanation}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            <button className="btn btn-ghost" onClick={() => setStep('reveal')} style={{
              fontSize: '1.1rem', padding: '16px 32px'
            }}>← Zpět na výsledky</button>
            <button className="btn btn-gold" onClick={onContinue} style={{
              fontSize: 'clamp(1.1rem, 1.8vw, 1.6rem)', padding: '20px 52px'
            }}>
              Výborně! Dál →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
