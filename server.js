import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { networkInterfaces } from 'os'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getLocalIP() {
  const nets = Object.values(networkInterfaces()).flat()
  const net = nets.find(n => n.family === 'IPv4' && !n.internal)
  return net?.address || 'localhost'
}

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

// index.html must never be cached by CDN
app.get('/', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.setHeader('Surrogate-Control', 'no-store')
  res.setHeader('Pragma', 'no-cache')
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(express.static('dist'))
app.use(express.static('public'))

const server = createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

let gameState = {
  phase: 'waiting',
  question: null,
  answers: {}
}

app.get('/join', (req, res) => {
  res.sendFile(path.join(__dirname, 'mobile.html'))
})

app.get('/health', (req, res) => res.json({ status: 'ok' }))

async function callAnthropic(prompt, max_tokens, model = 'claude-haiku-4-5-20251001') {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  const data = await res.json()
  if (!res.ok) {
    console.error('Anthropic API error:', res.status, JSON.stringify(data))
    throw new Error(data.error?.message || `HTTP ${res.status}`)
  }
  return data.content?.[0]?.text || ''
}

app.post('/api/teaching', async (req, res) => {
  const { question } = req.body
  if (!question) return res.status(400).json({ error: 'Chybí question' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Chybí ANTHROPIC_API_KEY' })

  const prompt = `Jsi přátelský a trpělivý učitel pro děti ve věku 8–12 let.
Dostal jsi tuto testovou otázku z přijímaček na gymnázium:
${question.context ? `\nVÝCHOZÍ TEXT K ÚLOZE:\n${question.context}\n` : ''}
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
    const text = await callAnthropic(prompt, 800, 'claude-sonnet-4-6')
    res.json({ text })
  } catch (err) {
    console.error('/api/teaching error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/smartpaste', async (req, res) => {
  console.log('smartpaste request přijat, délka textu:', req.body?.text?.length)
  console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY)
  const { text: rawText } = req.body
  if (!rawText) return res.status(400).json({ error: 'Chybí text' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'Chybí ANTHROPIC_API_KEY' })

  const prompt = `Zparsuj testovou otázku a urči její typ:
- "mc" pokud má výběr jedné odpovědi z možností A–E
- "an" pokud se ptá zda jsou tvrzení pravdivá (Ano/Ne, A/N, pravda/nepravda)
- "match" pokud přiřazuje možnosti k položkám

Pokud text obsahuje výchozí text k úloze (např. báseň, odstavec, tabulku, graf nebo jiný text PŘED samotnou otázkou), extrahuj ho do pole "context". Jinak nastav "context" na null.

TEXT: ${rawText}

Pro mc vrať:
{
  "type": "mc",
  "subject": "matematika" nebo "čeština",
  "category": "stručný název tématu",
  "difficulty": číslo 1-5,
  "context": null nebo "výchozí text k úloze pokud existuje",
  "question": "text otázky",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."} (nebo A–E pokud 5 možností),
  "correct_option": "A"–"E",
  "answer": "správná odpověď slovně",
  "answer_explanation": "krátké vysvětlení proč",
  "hints": ["hint 1", "hint 2"]
}

Pro an vrať:
{
  "type": "an",
  "subject": "matematika" nebo "čeština",
  "category": "stručný název tématu",
  "difficulty": číslo 1-5,
  "context": null nebo "výchozí text k úloze pokud existuje",
  "question": "úvodní text otázky",
  "subitems": [
    {"id": "1", "question": "text tvrzení 1", "correct_option": "A" nebo "N"},
    {"id": "2", "question": "text tvrzení 2", "correct_option": "A" nebo "N"}
  ],
  "answer_explanation": "krátké souhrnné vysvětlení",
  "hints": ["hint 1", "hint 2"]
}

Pro match vrať:
{
  "type": "match",
  "subject": "matematika" nebo "čeština",
  "category": "stručný název tématu",
  "difficulty": číslo 1-5,
  "context": null nebo "výchozí text k úloze pokud existuje",
  "question": "text instrukce (co přiřazujeme)",
  "options": {"A": "...", "B": "...", "C": "...", "D": "..."} (pravá strana — co se přiřazuje K),
  "subitems": [
    {"id": "1", "question": "položka 1 (levá strana)", "correct_option": "B"},
    {"id": "2", "question": "položka 2", "correct_option": "A"}
  ],
  "correct_option": {"1": "B", "2": "A"},
  "answer_explanation": "krátké vysvětlení",
  "hints": ["hint 1"]
}

Pokud mc otázka nemá možnosti A/B/C/D, vymysli 3 věrohodné špatné odpovědi jako distraktory.
Pokud nevíš správnou odpověď, nastav correct_option na "A" a answer_explanation na "Doplňte ručně".

DŮLEŽITÉ: Odpověz POUZE čistým JSON objektem. Žádný text před ani po. Žádné markdown backticky. Jen { ... }`

  try {
    const text = await callAnthropic(prompt, 1000)
    console.log('smartpaste AI response délka:', text?.length, 'preview:', text?.slice(0, 100))
    try {
      res.json(JSON.parse(text))
    } catch {
      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      try {
        res.json(JSON.parse(clean))
      } catch (e) {
        console.error('/api/smartpaste JSON parse failed:', e.message, '\nRaw:', text.slice(0, 500))
        res.status(500).json({ error: 'JSON parse failed', raw: text.slice(0, 200) })
      }
    }
  } catch (err) {
    console.error('smartpaste error:', err.message, err.stack)
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/end-round', (req, res) => {
  gameState = { phase: 'waiting', question: null, answers: {} }
  io.emit('game-state', gameState)
  io.emit('round-ended')
  res.json({ ok: true })
})

app.get('/ip', (req, res) => {
  res.json({
    url: process.env.RAILWAY_PUBLIC_DOMAIN
      ? 'https://' + process.env.RAILWAY_PUBLIC_DOMAIN
      : 'http://' + getLocalIP() + ':3001'
  })
})

io.on('connection', (socket) => {
  console.log('připojeno:', socket.id)

  socket.on('start-question', (question) => {
    gameState = { phase: 'question', question, answers: {} }
    io.emit('game-state', gameState)
  })

  socket.on('submit-answer', ({ profileId, answer }) => {
    gameState.answers[profileId] = answer
    io.emit('answer-received', { profileId, answer })
    io.emit('game-state', gameState)
  })

  socket.on('end-question', () => {
    gameState = { phase: 'waiting', question: null, answers: {} }
    io.emit('game-state', gameState)
    io.emit('round-ended')
  })

  socket.emit('game-state', gameState)
})

const PORT = process.env.PORT || 3001
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP()
  console.log(`Socket server běží na portu ${PORT}`)
  if (!process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`Mobily se připojí na: http://${ip}:${PORT}/join`)
  } else {
    console.log(`Mobily se připojí na: https://${process.env.RAILWAY_PUBLIC_DOMAIN}/join`)
  }
})
