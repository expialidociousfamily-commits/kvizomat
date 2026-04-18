import { useState, useEffect } from 'react'

export default function PhaseReveal({ question, answers, profiles, onContinue }) {
  const [step, setStep] = useState('reveal') // reveal | explain
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 400)
    return () => clearTimeout(t)
  }, [])

  const correct = question.correct_option

  function getResult(profileId) {
    return answers[profileId] === correct
  }

  const winners = profiles.filter(p => getResult(p.id))
  const allCorrect = winners.length === profiles.length
  const noneCorrect = winners.length === 0

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
              textAlign: 'center'
            }}>
              <div style={{ color: 'var(--muted)', fontSize: '1rem', marginBottom: 8 }}>Správná odpověď</div>
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
            </div>
          )}

          {/* Profile results */}
          <div style={{ display: 'flex', gap: '2%', marginBottom: '3%' }}>
            {profiles.map((p, i) => {
              const ok = getResult(p.id)
              const ans = answers[p.id]
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
                  <div style={{
                    fontSize: '1rem', marginTop: 8,
                    color: ok ? 'var(--green)' : 'var(--red)'
                  }}>
                    {ans ? `Odpověděl/a: ${ans}` : 'Bez odpovědi'}
                    {ok && <div style={{ color: 'var(--gold)', fontWeight: 800 }}>+10 bodů</div>}
                  </div>
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
            <div style={{ fontWeight: 800, color: 'var(--gold)', marginBottom: 16, fontSize: '1.15em' }}>
              Správná odpověď: {correct} — {question.options[correct]}
            </div>
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
