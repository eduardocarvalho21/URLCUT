// server.js
import 'dotenv/config'
import express from 'express'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import urlRoutes from './routes/urls.js'
import { redirect } from './controllers/urlController.js'

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = dirname(fileURLToPath(import.meta.url))

app.use(express.json())
app.use(express.static(__dirname))

app.use('/urls', urlRoutes)
app.get('/health', (_, res) => res.json({ status: 'ok' }))
app.get('/:slug', redirect)

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
})
