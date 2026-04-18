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
    gameState.phase = 'waiting'
    io.emit('game-state', gameState)
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
