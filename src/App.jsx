import { useState, useEffect } from 'react'
import LoginScreen from './components/LoginScreen'
import HomeScreen from './components/HomeScreen'
import PhaseTeaching from './components/PhaseTeaching'
import PhaseQuestion from './components/PhaseQuestion'
import PhaseReveal from './components/PhaseReveal'
import SessionSummary from './components/SessionSummary'
import ParentPanel from './components/ParentPanel'
import { questions as defaultQuestions, PROFILES } from './data/questions'
import { generateTeaching } from './utils/claude'
import './App.css'

const PHASES = ['home', 'teaching', 'question', 'reveal', 'summary', 'parent']

function loadStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}

function calcStats(questions, profileId) {
  const played   = questions.filter(q => q.played && q.results)
  const answered = played.filter(q => q.results[profileId] !== undefined)
  const correct  = answered.filter(q => q.results[profileId] === true)
  return {
    answered: answered.length,
    correct: correct.length,
    pct: answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : null
  }
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('kviz_auth') === 'true')
  const [phase, setPhase] = useState('home')
  const [questions, setQuestions] = useState(() => {
    const stored = loadStorage('kviz_questions', null)
    if (!stored || stored.length === 0) return defaultQuestions
    const storedIds = new Set(stored.map(q => q.id))
    const missing = defaultQuestions.filter(q => !storedIds.has(q.id))
    return missing.length > 0 ? [...stored, ...missing] : stored
  })

  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [aiExplanation, setAiExplanation] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [answers, setAnswers] = useState({})
  const [streak, setStreak] = useState(() => loadStorage('kviz_streak', 0))
  const [points, setPoints] = useState(() =>
    loadStorage('kviz_points', { tata: 0, mama: 0, mia: 0, centik: 0, host: 0 })
  )
  // Save to localStorage on change
  useEffect(() => { localStorage.setItem('kviz_questions', JSON.stringify(questions)) }, [questions])
  useEffect(() => { localStorage.setItem('kviz_streak', JSON.stringify(streak)) }, [streak])
  useEffect(() => { localStorage.setItem('kviz_points', JSON.stringify(points)) }, [points])

  // Phase transitions
  async function startSession() {
    const q = questions.find(q => !q.played)
    if (!q) {
      alert('Všechny otázky byly odehrány!')
      return
    }
    setCurrentQuestion(q)
    setAnswers({})
    setAiExplanation('')
    setAiLoading(true)
    setPhase('teaching')

    const explanation = await generateTeaching(q)
    setAiExplanation(explanation)
    setAiLoading(false)
  }

  async function handleSimpler() {
    if (!currentQuestion) return
    setAiLoading(true)
    setAiExplanation('')
    const simpler = await generateTeaching({
      ...currentQuestion,
      question: '[JEDNODUŠŠÍ VERZE] ' + currentQuestion.question
    })
    setAiExplanation(simpler)
    setAiLoading(false)
  }

  function handleTeachingDone() {
    setPhase('question')
  }

  function handleAnswers(selectedAnswers) {
    setAnswers(selectedAnswers)
    setPhase('reveal')
  }

  function handleRevealDone() {
    const correct = currentQuestion.correct_option
    const newPoints = { ...points }
    PROFILES.forEach(p => {
      if (answers?.[p.id] === correct) newPoints[p.id] = (newPoints[p.id] || 0) + 10
    })
    const results = {}
    PROFILES.forEach(p => { results[p.id] = answers?.[p.id] === correct })
    setQuestions(prev => prev.map(q =>
      q.id === currentQuestion.id ? { ...q, played: true, results } : q
    ))
    setPoints(newPoints)
    setStreak(s => s + 1)
    setPhase('summary')
  }

  function handleHome() {
    setPhase('home')
    setCurrentQuestion(null)
    setAiExplanation('')
    setAnswers({})
  }

  function addQuestion(q) {
    setQuestions(prev => [...prev, q])
  }

  function updateQuestion(q) {
    setQuestions(prev => prev.map(existing => existing.id === q.id ? q : existing))
  }

  function deleteQuestion(id) {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  function reorderQuestions(newQuestions) {
    setQuestions(newQuestions)
  }

  function updateStreak(value) {
    setStreak(Number(value))
  }

  function updatePoints(newPoints) {
    setPoints(newPoints)
  }

  function updateResult(questionId, profileId, value) {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q
      const results = { ...q.results }
      if (value === undefined) delete results[profileId]
      else results[profileId] = value
      return { ...q, results }
    }))
  }

  // Progress indicator
  const progressMap = { home: 0, teaching: 25, question: 55, reveal: 80, summary: 100, parent: 0 }
  const progress = progressMap[phase] || 0

  if (!authed) {
    return <LoginScreen onLogin={() => { sessionStorage.setItem('kviz_auth', 'true'); setAuthed(true) }} />
  }

  return (
    <div className="tv-canvas">
      <div className="tv-screen">
        {/* Progress bar (hidden on home/parent) */}
        {phase !== 'home' && phase !== 'parent' && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Phase label strip */}
        {phase !== 'home' && phase !== 'parent' && (
          <div style={{
            position: 'absolute', top: 5, right: 24,
            display: 'flex', gap: 8, zIndex: 10
          }}>
            {[
              ['teaching', '🎓 Výuka'],
              ['question', '✏️ Otázka'],
              ['reveal', '🎬 Reveal'],
              ['summary', '🏆 Výsledky']
            ].map(([p, label]) => (
              <div key={p} style={{
                padding: '3px 12px', borderRadius: 20,
                fontSize: '0.75rem', fontWeight: 700,
                background: phase === p ? 'var(--gold)' : 'rgba(255,255,255,0.06)',
                color: phase === p ? '#000' : 'var(--muted)',
                transition: 'all 0.3s'
              }}>{label}</div>
            ))}
          </div>
        )}

        {/* Screens */}
        {phase === 'home' && (
          <HomeScreen
            streak={streak}
            points={points}
            stats={Object.fromEntries(PROFILES.map(p => [p.id, calcStats(questions, p.id)]))}
            profiles={PROFILES}
            onStart={startSession}
            onParent={() => setPhase('parent')}
          />
        )}

        {phase === 'teaching' && currentQuestion && (
          <PhaseTeaching
            question={currentQuestion}
            explanation={aiExplanation}
            loading={aiLoading}
            onContinue={handleTeachingDone}
            onSimpler={handleSimpler}
          />
        )}

        {phase === 'question' && currentQuestion && (
          <PhaseQuestion
            question={currentQuestion}
            profiles={PROFILES}
            onSubmitAnswers={handleAnswers}
          />
        )}

        {phase === 'reveal' && currentQuestion && (
          <PhaseReveal
            question={currentQuestion}
            answers={answers}
            profiles={PROFILES}
            onContinue={handleRevealDone}
          />
        )}

        {phase === 'summary' && currentQuestion && (
          <SessionSummary
            question={currentQuestion}
            answers={answers}
            profiles={PROFILES}
            streak={streak}
            onHome={handleHome}
          />
        )}

        {phase === 'parent' && (
          <ParentPanel
            questions={questions}
            streak={streak}
            points={points}
            onAddQuestion={addQuestion}
            onUpdateQuestion={updateQuestion}
            onDeleteQuestion={deleteQuestion}
            onReorderQuestions={reorderQuestions}
            onUpdateResult={updateResult}
            onUpdateStreak={updateStreak}
            onUpdatePoints={updatePoints}
            onClose={() => setPhase('home')}
          />
        )}
      </div>
    </div>
  )
}
