import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

import carsRouter from './routes/carsRoutes.js'
import optionsRouter from './routes/optionsRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/cars', carsRouter)
app.use('/api/options', optionsRouter)

app.get('/api', (req, res) => {
  res.status(200).send('<h1>DIY Auto Crafter API Server Running</h1>')
})

// Serve production static assets if client build exists
const clientDistPath = path.join(__dirname, '../client/dist')
app.use(express.static(clientDistPath))

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
      if (err) {
        res.status(200).send('<h1>DIY Auto Crafter API Server</h1>')
      }
    })
  }
})

// Only start listening if this file was run directly (e.g. `node server/server.js`)
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
  })
}

export default app
