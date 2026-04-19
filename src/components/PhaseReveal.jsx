import { useState, useEffect } from 'react'

export default function PhaseReveal({ question, answers, profiles, onContinue }) {
  const [step, setStep] = useState('reveal') // reveal | explain
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 400)
    return () => clearTimeout(t)
  }, [])

  const type = question.type || 'mc'
  const isSubitemType = type === 'an' || type === 'match'

  function getResult(profileId) {
    if (isSubitemType) {
      const ans = answers[profileId] || {}
      return question.subitems.every(si => ans[si.id] === si.correct_option)
    }
    return answers[profileId] === question.correct_option
  }

  function getSubitemScore(profileId) {
    if (!isSubitemType) return null
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
          <div style={{ textAlign: 'center', marginBottom: '2%' }}>
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
              padding: '2.5% 3.5%', marginBottom: '2%',
              borderColor: 'var(--green)', background: 'rgba(34,197,94,0.07)'
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: 10 }}>Správná odpověď</div>

              {/* MC: single option badge */}
              {type === 'mc' && (
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {question.subitems.map((si, idx) => (
                    <div key={si.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)'
                    }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 700, minWidth: 20, fontSize: '0.85rem' }}>{idx + 1}.</span>
                      <span style={{ flex: 1, fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 600 }}>{si.question}</span>
                      <div style={{
                        padding: '3px 12px', borderRadius: 7, flexShrink: 0,
                        background: si.correct_option === 'A' ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)',
                        color: si.correct_option === 'A' ? 'var(--green)' : 'var(--red)',
                        fontWeight: 800, fontSize: '0.95rem'
                      }}>
                        {si.correct_option === 'A' ? 'ANO' : 'NE'}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* match: subitems → correct option + text */}
              {type === 'match' && question.subitems && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {question.subitems.map((si, idx) => (
                    <div key={si.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)'
                    }}>
                      <span style={{ color: 'var(--muted)', fontWeight: 700, minWidth: 20, fontSize: '0.85rem' }}>{idx + 1}.</span>
                      <span style={{ flex: 1, fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 600 }}>{si.question}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: 'var(--green)', color: '#000',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.9rem'
                        }}>{si.correct_option}</div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--green)' }}>
                          {question.options?.[si.correct_option]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile results */}
          <div style={{ display: 'flex', gap: '2%', marginBottom: '2%' }}>
            {profiles.map((p, i) => {
              const ok = getResult(p.id)
              const ans = answers[p.id]
              const score = getSubitemScore(p.id)
              return (
                <div key={p.id} className="card pop" style={{
                  flex: 1, padding: '2.5% 2%', textAlign: 'center',
                  borderColor: ok ? 'var(--green)' : 'var(--red)',
                  background: ok ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)',
                  animationDelay: `${0.2 + i * 0.1}s`
                }}>
                  <div style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>{p.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.1rem', margin: '6px 0' }}>{p.name}</div>
                  <div style={{ fontSize: '2.2rem' }}>{ok ? '✅' : '❌'}</div>
                  <div style={{ fontSize: '0.95rem', marginTop: 6, color: ok ? 'var(--green)' : 'var(--red)' }}>
                    {isSubitemType && score !== null
                      ? `${score.correct}/${score.total} správně`
                      : ans ? `Odpověděl/a: ${ans}` : 'Bez odpovědi'
                    }
                    {ok && <div style={{ color: 'var(--gold)', fontWeight: 800 }}>+10 bodů</div>}
                  </div>

                  {/* Subitem mini breakdown for wrong answers (AN + match) */}
                  {isSubitemType && question.subitems && !ok && ans && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {question.subitems.map((si, idx) => {
                        const profileAns = (answers[p.id] || {})[si.id]
                        const subOk = profileAns === si.correct_option
                        return (
                          <div key={si.id} style={{
                            width: 24, height: 24, borderRadius: 5,
                            background: subOk ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                            color: subOk ? 'var(--green)' : 'var(--red)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 800
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
            fontSize: 'clamp(1.1rem, 1.7vw, 1.5rem)', lineHeight: 1.7, marginBottom: '2%'
          }}>
            {/* MC: correct option header */}
            {type === 'mc' && (
              <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 16, fontSize: '1.15em' }}>
                Správná odpověď: {correct} — {question.options[correct]}
              </div>
            )}

            {/* AN: subitem summary */}
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
                        padding: '2px 10px', borderRadius: 6, fontWeight: 800, fontSize: '0.85em',
                        background: si.correct_option === 'A' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        color: si.correct_option === 'A' ? 'var(--green)' : 'var(--red)'
                      }}>{si.correct_option === 'A' ? 'ANO' : 'NE'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* match: subitem → option table */}
            {type === 'match' && question.subitems && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 10, fontSize: '1.05em' }}>
                  Správná přiřazení:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {question.subitems.map((si, idx) => (
                    <div key={si.id} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.95em' }}>
                      <span style={{ color: 'var(--muted)', minWidth: 20 }}>{idx + 1}.</span>
                      <span style={{ flex: 1 }}>{si.question}</span>
                      <span style={{ color: 'var(--muted)', margin: '0 4px' }}>→</span>
                      <div style={{
                        width: 26, height: 26, borderRadius: 6,
                        background: 'rgba(34,197,94,0.2)', color: 'var(--green)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.85em', flexShrink: 0
                      }}>{si.correct_option}</div>
                      <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.9em' }}>
                        {question.options?.[si.correct_option]}
                      </span>
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
