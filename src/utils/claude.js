const BACKEND = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export async function generateTeaching(question) {
  try {
    const res = await fetch(`${BACKEND}/api/teaching`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.text) return data.text
    return getFallback(question)
  } catch (err) {
    console.error('generateTeaching error:', err)
    return getFallback(question)
  }
}

export async function smartPaste(rawText) {
  try {
    const res = await fetch(`${BACKEND}/api/smartpaste`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: rawText })
    })
    if (!res.ok) {
      console.error('smartPaste: HTTP', res.status)
      return null
    }
    return await res.json()
  } catch (e) {
    console.error('smartPaste: fetch error:', e)
    return null
  }
}

function getFallback(question) {
  return `📦 *Offline mód — AI není dostupná*\n\n${question.static_teaching_note}\n\n**Postup:**\n${question.answer_explanation}\n\n💡 Zkus si přečíst otázku pozorně a použij tuto metodu!`
}
