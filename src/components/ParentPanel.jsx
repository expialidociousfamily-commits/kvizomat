import { useState } from 'react'
import { smartPaste } from '../utils/claude'
import { PROFILES } from '../data/questions'

const emptyManual = {
  type: 'mc',
  subject: 'matematika', category: '', question: '',
  options: { A: '', B: '', C: '', D: '' },
  correct_option: 'A', answer: '', answer_explanation: '',
  hints: [], difficulty: 2, emoji: '📝',
  subitems: [{ id: '1', question: '', correct_option: 'A' }]
}

const inputStyle = { width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '1rem' }

export default function ParentPanel({ questions, streak, points, onAddQuestion, onUpdateQuestion, onDeleteQuestion, onReorderQuestions, onUpdateResult, onUpdateStreak, onUpdatePoints, onClose }) {
  const [tab, setTab] = useState('queue')   // queue | add | results | settings
  const [pasteText, setPasteText] = useState('')
  const [parsed, setParsed] = useState(null)
  const [parsing, setParsing] = useState(false)
  const [parseError, setParseError] = useState('')
  const [pin, setPin] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [editStreak, setEditStreak] = useState(streak)
  const [editPoints, setEditPoints] = useState({ ...points })
  const [manualQ, setManualQ] = useState(emptyManual)

  if (!unlocked) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 24
      }}>
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <div className="display" style={{ fontSize: '3rem', color: 'var(--gold)' }}>SPRÁVA OTÁZEK</div>
        <div style={{ color: 'var(--muted)' }}>Zadejte PIN</div>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={e => setPin(e.target.value)}
          placeholder="••••"
          style={{
            background: 'var(--surface)', border: '2px solid var(--border)',
            borderRadius: 12, padding: '16px 24px',
            color: 'var(--text)', fontSize: '2rem', textAlign: 'center',
            width: 160, outline: 'none', fontFamily: 'var(--font-body)',
            letterSpacing: 12
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && pin === '8205') setUnlocked(true)
          }}
        />
        <div style={{ display: 'flex', gap: 16 }}>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '14px 28px', fontSize: '1rem' }}>← Zpět</button>
          <button className="btn btn-gold" onClick={() => pin === '8205' && setUnlocked(true)} style={{ padding: '14px 28px', fontSize: '1rem' }}>Potvrdit</button>
        </div>
      </div>
    )
  }

  function moveQuestion(id, direction) {
    const pending = questions.filter(q => !q.played)
    const played  = questions.filter(q => q.played === true)
    const idx = pending.findIndex(q => q.id === id)
    if (idx === -1) return
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= pending.length) return
    const newPending = [...pending]
    ;[newPending[idx], newPending[swapIdx]] = [newPending[swapIdx], newPending[idx]]
    onReorderQuestions([...newPending, ...played])
  }

  async function handleSmartParse() {
    if (!pasteText.trim()) return
    setParsing(true)
    setParseError('')
    const result = await smartPaste(pasteText)
    if (result === null) {
      setParseError('❌ Nepodařilo se zparsovat. Zkuste to znovu nebo zadejte ručně.')
    } else {
      setParseError('')
    }
    setParsed(result)
    setParsing(false)
  }

  function saveQuestion(q) {
    const exists = questions.some(existing => existing.id === q.id)
    if (exists) {
      onUpdateQuestion({ ...q, static_teaching_note: q.answer_explanation })
    } else {
      onAddQuestion({
        ...q,
        id: 'custom_' + Date.now(),
        emoji: q.subject === 'matematika' ? '🔢' : '📖',
        static_teaching_note: q.answer_explanation
      })
    }
    setManualQ(emptyManual)
    setParsed(null)
    setPasteText('')
    setTab('queue')
  }

  function startEdit(q) {
    setManualQ({
      id: q.id,
      type: q.type || 'mc',
      subject: q.subject || 'matematika',
      category: q.category || '',
      question: q.question || '',
      options: { A: '', B: '', C: '', D: '', ...q.options },
      correct_option: q.correct_option || 'A',
      answer: q.answer || '',
      answer_explanation: q.answer_explanation || q.static_teaching_note || '',
      hints: q.hints || [],
      difficulty: q.difficulty || 2,
      emoji: q.emoji || '📝',
      subitems: q.subitems || [{ id: '1', question: '', correct_option: 'A' }]
    })
    setTab('add')
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '2% 4%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
        <div className="display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--gold)' }}>
          ⚙️ SPRÁVA OTÁZEK
        </div>
        <button className="btn btn-ghost" onClick={onClose} style={{ padding: '12px 24px', fontSize: '1rem' }}>
          ✕ Zavřít
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '2%' }}>
        {[['queue', '📋 Fronta otázek'], ['add', '➕ Přidat otázku'], ['results', '📊 Výsledky'], ['settings', '⚙️ Nastavení']].map(([id, label]) => (
          <button key={id} className={`btn ${tab === id ? 'btn-gold' : 'btn-ghost'}`}
            onClick={() => setTab(id)}
            style={{ padding: '12px 24px', fontSize: '1rem' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Queue tab */}
      {tab === 'queue' && (
        <div className="scrollable" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.length === 0 && (
            <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 60, fontSize: '1.3rem' }}>
              Žádné otázky. Přidejte první! →
            </div>
          )}
          {(() => {
            const pending = questions.filter(q => !q.played)
            const played  = questions.filter(q => q.played === true)
            const renderCard = (q, isPlayed, pendingIdx) => (
              <div key={q.id} className="card" style={{
                padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16,
                opacity: isPlayed ? 0.7 : 1,
                borderLeft: isPlayed ? '4px solid var(--green)' : undefined
              }}>
                {!isPlayed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button className="btn btn-ghost" onClick={() => moveQuestion(q.id, 'up')}
                      disabled={pendingIdx === 0}
                      style={{ width: 36, height: 36, padding: 0, fontSize: '1rem', opacity: pendingIdx === 0 ? 0.3 : 1 }}>
                      ↑
                    </button>
                    <button className="btn btn-ghost" onClick={() => moveQuestion(q.id, 'down')}
                      disabled={pendingIdx === pending.length - 1}
                      style={{ width: 36, height: 36, padding: 0, fontSize: '1rem', opacity: pendingIdx === pending.length - 1 ? 0.3 : 1 }}>
                      ↓
                    </button>
                  </div>
                )}
                <div style={{ fontSize: '1.5rem' }}>{q.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{q.question.slice(0, 80)}...</div>
                  <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                    {q.subject} · {q.category} · Obtížnost {q.difficulty}/5
                  </div>
                  {isPlayed && q.results && (
                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                      {PROFILES.map(p => (
                        <span key={p.id} style={{ fontSize: '0.9rem' }}>
                          {p.emoji}{q.results[p.id] ? '✅' : '❌'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  <div style={{
                    padding: '6px 14px', borderRadius: 8,
                    background: 'rgba(34,197,94,0.15)',
                    color: 'var(--green)', fontSize: '0.85rem', fontWeight: 700
                  }}>
                    Odpověď: {q.correct_option}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {isPlayed && (
                      <button className="btn btn-ghost" onClick={() => {
                        const pending = questions.filter(x => !x.played)
                        const played  = questions.filter(x => x.played === true)
                        const reset   = { ...q, played: false, results: null }
                        onReorderQuestions([...pending, reset, ...played.filter(x => x.id !== q.id)])
                      }}
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                        📥 Znovu zařadit
                      </button>
                    )}
                    <button className="btn btn-ghost" onClick={() => startEdit(q)}
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                      ✏️ Upravit
                    </button>
                    <button className="btn btn-ghost" onClick={() => onDeleteQuestion(q.id)}
                      style={{ padding: '6px 14px', fontSize: '0.85rem', color: '#f87171' }}>
                      🗑 Smazat
                    </button>
                  </div>
                </div>
              </div>
            )
            return (
              <>
                {pending.length > 0 && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--muted)', paddingLeft: 4 }}>
                      ⏳ Čeká na odehrání ({pending.length})
                    </div>
                    {pending.map((q, i) => renderCard(q, false, i))}
                  </>
                )}
                {played.length > 0 && (
                  <>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green)', paddingLeft: 4, marginTop: pending.length > 0 ? 8 : 0 }}>
                      ✅ Odehráno ({played.length})
                    </div>
                    {played.map(q => renderCard(q, true))}
                  </>
                )}
              </>
            )
          })()}
        </div>
      )}

      {/* Results tab */}
      {tab === 'results' && (
        <div className="scrollable" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.filter(q => q.played).length === 0 && (
            <div style={{ color: 'var(--muted)', textAlign: 'center', marginTop: 60, fontSize: '1.3rem' }}>
              Zatím žádné odehrané otázky.
            </div>
          )}
          {[...questions].filter(q => q.played).reverse().map(q => (
            <div key={q.id} className="card" style={{ padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: '1.3rem' }}>{q.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{q.question.slice(0, 80)}...</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {PROFILES.map(p => {
                  const val = q.results?.[p.id]
                  const cycle = val === undefined ? true : val === true ? false : undefined
                  const [bg, color, icon] = val === true
                    ? ['rgba(34,197,94,0.15)', 'var(--green)', '✅']
                    : val === false
                    ? ['rgba(248,113,113,0.15)', '#f87171', '❌']
                    : ['rgba(255,255,255,0.06)', 'var(--muted)', '➕']
                  return (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.1rem', width: 28 }}>{p.emoji}</span>
                      <span style={{ flex: 1, fontSize: '0.95rem', color: 'var(--muted)' }}>{p.name}</span>
                      <button
                        onClick={() => onUpdateResult(q.id, p.id, cycle)}
                        style={{
                          padding: '5px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                          background: bg, color, fontSize: '0.9rem', fontWeight: 700
                        }}>
                        {icon}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings tab */}
      {tab === 'settings' && (
        <div className="scrollable" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Streak */}
          <div className="card" style={{ padding: '3% 4%' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 16 }}>🔥 Streak</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="number" min={0}
                value={editStreak}
                onChange={e => setEditStreak(e.target.value)}
                style={{ width: 120, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '1.1rem' }}
              />
              <button className="btn btn-gold" onClick={() => onUpdateStreak(editStreak)}
                style={{ padding: '10px 24px', fontSize: '1rem' }}>
                Uložit
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="card" style={{ padding: '3% 4%' }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 16 }}>⭐ Body hráčů</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PROFILES.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '1.3rem', width: 32 }}>{p.emoji}</span>
                  <span style={{ flex: 1, fontWeight: 700 }}>{p.name}</span>
                  <input
                    type="number" min={0}
                    value={editPoints[p.id] ?? 0}
                    onChange={e => setEditPoints(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                    style={{ width: 120, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: '1.1rem' }}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-gold" onClick={() => onUpdatePoints(editPoints)}
              style={{ marginTop: 16, padding: '10px 24px', fontSize: '1rem' }}>
              Uložit vše
            </button>
          </div>
        </div>
      )}

      {/* Add tab */}
      {tab === 'add' && (
        <div className="scrollable" style={{ flex: 1 }}>
          {/* Smart Paste */}
          <div className="card" style={{ padding: '3% 4%', marginBottom: 20 }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 12, color: 'var(--blue)' }}>
              🪄 Smart Paste — vložte text otázky
            </div>
            <textarea
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
              placeholder="Vložte text otázky z knihy nebo CERMAT... AI ji automaticky zparsuje."
              style={{
                width: '100%', height: 120,
                background: 'var(--bg)', border: '2px solid var(--border)',
                borderRadius: 12, padding: 16,
                color: 'var(--text)', fontSize: '1rem',
                fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none'
              }}
            />
            <button className="btn btn-gold" onClick={handleSmartParse} disabled={parsing || !pasteText.trim()}
              style={{ marginTop: 12, padding: '14px 32px', fontSize: '1rem', opacity: pasteText.trim() ? 1 : 0.4 }}>
              {parsing ? '⏳ Zpracovávám...' : '🪄 Zparsovat pomocí AI'}
            </button>
            {parseError && (
              <div style={{ marginTop: 10, color: '#f87171', fontSize: '0.95rem', fontWeight: 600 }}>
                {parseError}
              </div>
            )}
          </div>

          {/* Parsed result */}
          {parsed && (
            <div className="card fade-up" style={{ padding: '3% 4%', borderColor: 'var(--green)', marginBottom: 20 }}>
              <div style={{ fontWeight: 800, color: 'var(--green)', marginBottom: 16 }}>
                ✅ AI zparsovala otázku ({parsed.type || 'mc'}) — zkontrolujte a uložte:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                  ['Předmět', parsed.subject],
                  ['Téma', parsed.category],
                  ['Typ', parsed.type || 'mc'],
                  ['Obtížnost', parsed.difficulty + '/5']
                ].map(([label, val]) => (
                  <div key={label}>
                    <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>{label}</div>
                    <div style={{ fontWeight: 700 }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Otázka</div>
                <div style={{ fontWeight: 700 }}>{parsed.question}</div>
              </div>

              {/* MC / match: options preview */}
              {(parsed.type === 'mc' || parsed.type === 'match' || !parsed.type) && parsed.options && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {Object.entries(parsed.options).map(([k, v]) => (
                    <div key={k} style={{
                      flex: '1 1 45%', padding: '8px 12px', borderRadius: 8,
                      background: k === parsed.correct_option ? 'rgba(34,197,94,0.15)' : 'var(--bg)',
                      border: '1px solid ' + (k === parsed.correct_option ? 'var(--green)' : 'var(--border)'),
                      fontSize: '0.9rem'
                    }}>
                      <strong>{k}:</strong> {v}
                    </div>
                  ))}
                </div>
              )}

              {/* AN: subitems preview */}
              {parsed.type === 'an' && parsed.subitems && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
                  {parsed.subitems.map((si, idx) => (
                    <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--muted)', minWidth: 20, fontSize: '0.85rem' }}>{idx + 1}.</span>
                      <span style={{ flex: 1, fontSize: '0.9rem' }}>{si.question}</span>
                      <span style={{
                        padding: '3px 10px', borderRadius: 6, fontWeight: 800, fontSize: '0.85rem',
                        background: si.correct_option === 'A' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                        color: si.correct_option === 'A' ? 'var(--green)' : 'var(--red)'
                      }}>{si.correct_option === 'A' ? 'ANO' : 'NE'}</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={() => setParsed(null)} style={{ padding: '12px 24px', fontSize: '1rem' }}>
                  ✕ Zrušit
                </button>
                <button className="btn btn-gold" onClick={() => saveQuestion(parsed)} style={{ padding: '12px 28px', fontSize: '1rem' }}>
                  💾 Uložit otázku
                </button>
              </div>
            </div>
          )}

          {/* Manual entry */}
          <div className="card" style={{ padding: '3% 4%', borderColor: manualQ.id ? 'var(--gold)' : undefined }}>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 16, color: manualQ.id ? 'var(--gold)' : 'var(--muted)' }}>
              {manualQ.id ? '✏️ Upravit otázku' : '✏️ Nebo přidejte ručně'}
            </div>

            {/* Row 1: type + subject + category */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Typ otázky</label>
                <select value={manualQ.type} onChange={e => setManualQ(q => ({ ...q, type: e.target.value }))} style={inputStyle}>
                  <option value="mc">mc — výběr odpovědi</option>
                  <option value="an">an — ano / ne</option>
                  <option value="match">match — přiřazování</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Předmět</label>
                <select value={manualQ.subject} onChange={e => setManualQ(q => ({ ...q, subject: e.target.value }))} style={inputStyle}>
                  <option>matematika</option>
                  <option>čeština</option>
                </select>
              </div>
              <div>
                <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Téma</label>
                <input value={manualQ.category} onChange={e => setManualQ(q => ({ ...q, category: e.target.value }))}
                  placeholder="např. zlomky, pravopis..."
                  style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>
                {manualQ.type === 'an' ? 'Úvodní text (instrukce)' : 'Text otázky'}
              </label>
              <textarea value={manualQ.question} onChange={e => setManualQ(q => ({ ...q, question: e.target.value }))}
                style={{ ...inputStyle, height: 80, fontFamily: 'var(--font-body)', resize: 'none' }} />
            </div>

            {/* MC / match: options A–E */}
            {(manualQ.type === 'mc' || manualQ.type === 'match') && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                  {['A','B','C','D','E'].map(k => (
                    <div key={k}>
                      <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 4 }}>Možnost {k}</label>
                      <input value={manualQ.options[k] || ''} onChange={e => setManualQ(q => ({ ...q, options: { ...q.options, [k]: e.target.value } }))}
                        style={{ ...inputStyle, fontSize: '0.95rem', padding: '8px 12px' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Správná</label>
                    <select value={manualQ.correct_option} onChange={e => setManualQ(q => ({ ...q, correct_option: e.target.value, answer: q.options[e.target.value] || '' }))}
                      style={inputStyle}>
                      {['A','B','C','D','E'].filter(k => manualQ.options[k]).map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Vysvětlení</label>
                    <input value={manualQ.answer_explanation} onChange={e => setManualQ(q => ({ ...q, answer_explanation: e.target.value }))}
                      placeholder="Krátké vysvětlení proč je tato odpověď správná..."
                      style={inputStyle} />
                  </div>
                </div>
              </>
            )}

            {/* AN: dynamic subitems */}
            {manualQ.type === 'an' && (
              <>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--muted)', marginBottom: 10 }}>Tvrzení:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {manualQ.subitems.map((si, idx) => (
                    <div key={si.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--muted)', minWidth: 22, fontSize: '0.9rem', fontWeight: 700 }}>{idx + 1}.</span>
                      <input
                        value={si.question}
                        onChange={e => setManualQ(q => ({
                          ...q,
                          subitems: q.subitems.map(s => s.id === si.id ? { ...s, question: e.target.value } : s)
                        }))}
                        placeholder="Text tvrzení..."
                        style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: '0.95rem' }}
                      />
                      {/* A/N toggle */}
                      {['A', 'N'].map(opt => (
                        <button key={opt} onClick={() => setManualQ(q => ({
                          ...q,
                          subitems: q.subitems.map(s => s.id === si.id ? { ...s, correct_option: opt } : s)
                        }))} style={{
                          padding: '8px 14px', borderRadius: 8, border: '2px solid',
                          borderColor: si.correct_option === opt ? (opt === 'A' ? 'var(--green)' : 'var(--red)') : 'var(--border)',
                          background: si.correct_option === opt ? (opt === 'A' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent',
                          color: si.correct_option === opt ? (opt === 'A' ? 'var(--green)' : 'var(--red)') : 'var(--muted)',
                          fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.15s'
                        }}>
                          {opt === 'A' ? 'ANO' : 'NE'}
                        </button>
                      ))}
                      <button onClick={() => setManualQ(q => ({ ...q, subitems: q.subitems.filter(s => s.id !== si.id) }))}
                        style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: '#f87171', cursor: 'pointer', fontSize: '0.9rem' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-ghost" onClick={() => setManualQ(q => ({
                  ...q,
                  subitems: [...q.subitems, { id: String(q.subitems.length + 1), question: '', correct_option: 'A' }]
                }))} style={{ padding: '8px 18px', fontSize: '0.9rem', marginBottom: 16 }}>
                  + Přidat tvrzení
                </button>
                <div>
                  <label style={{ color: 'var(--muted)', fontSize: '0.85rem', display: 'block', marginBottom: 6 }}>Vysvětlení</label>
                  <input value={manualQ.answer_explanation} onChange={e => setManualQ(q => ({ ...q, answer_explanation: e.target.value }))}
                    placeholder="Souhrnné vysvětlení..."
                    style={{ ...inputStyle, marginBottom: 16 }} />
                </div>
              </>
            )}

            <button className="btn btn-gold" onClick={() => saveQuestion(manualQ)}
              disabled={!manualQ.question || (manualQ.type !== 'an' && !manualQ.options.A)}
              style={{ padding: '14px 32px', fontSize: '1rem', opacity: manualQ.question ? 1 : 0.4 }}>
              💾 Uložit otázku
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
