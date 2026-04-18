const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function generateTeaching(question) {
  if (!API_KEY) {
    return getFallback(question)
  }

  const prompt = `Jsi přátelský a trpělivý učitel pro děti ve věku 8–12 let.
Dostal jsi tuto testovou otázku z přijímaček na gymnázium:

OTÁZKA: ${question.question}
PŘEDMĚT: ${question.subject}
TÉMA: ${question.category}
SPRÁVNÁ ODPOVĚĎ: ${question.answer}

Tvůj úkol:
1. Vygeneruj PODOBNÝ, o trochu jednodušší příklad a vysvětli ho krok po kroku.
2. Použij konkrétní přirovnání ze života (jídlo, sport, hra, příroda).
3. Na konci jednou větou vysvětli PROČ to v životě potřebujeme umět.
4. Buď povzbudivý, hravý a zábavný.
5. Délka: max 250 slov. Používej emoji.
6. Formát: přehledný text s nadpisy a kroky — bude zobrazen na velké TV obrazovce.
7. NEZOBRAZUJ správnou odpověď na hlavní otázku — jen vysvětli METODU na podobném příkladě.

Začni přímo vysvětlením, bez úvodu jako "Samozřejmě!" nebo "Jasně!".`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    if (data.content?.[0]?.text) return data.content[0].text
    return getFallback(question)
  } catch {
    return getFallback(question)
  }
}

export async function smartPaste(rawText) {
  if (!API_KEY) {
    return null
  }

  const prompt = `Zparsuj tuto testovou otázku a vrať POUZE JSON (žádný markdown, žádné backticky):

TEXT: ${rawText}

Vrať JSON v tomto přesném formátu:
{
  "subject": "matematika" nebo "čeština",
  "category": "stručný název tématu",
  "difficulty": číslo 1-5,
  "question": "text otázky",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."},
  "correct_option": "A" nebo "B" nebo "C" nebo "D",
  "answer": "správná odpověď slovně",
  "answer_explanation": "krátké vysvětlení proč",
  "hints": ["hint 1", "hint 2"]
}

Pokud otázka nemá možnosti A/B/C/D, vymysli 3 věrohodné špatné odpovědi jako distraktory.
Pokud nevíš správnou odpověď, nastav correct_option na "A" a answer_explanation na "Doplňte ručně".

DŮLEŽITÉ: Odpověz POUZE čistým JSON objektem. Žádný text před ani po. Žádné markdown backticky. Jen { ... }`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    try {
      return JSON.parse(text)
    } catch (e1) {
      console.error('smartPaste: JSON.parse failed on raw text:', e1, '\nRaw:', text)
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        return JSON.parse(clean)
      } catch (e2) {
        console.error('smartPaste: JSON.parse failed after stripping backticks:', e2, '\nCleaned:', clean)
        return null
      }
    }
  } catch (e) {
    console.error('smartPaste: fetch/network error:', e)
    return null
  }
}

function getFallback(question) {
  return `📦 *Offline mód — AI není dostupná*\n\n${question.static_teaching_note}\n\n**Postup:**\n${question.answer_explanation}\n\n💡 Zkus si přečíst otázku pozorně a použij tuto metodu!`
}
