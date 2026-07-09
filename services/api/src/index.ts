import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    // simple DB check
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected' })
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', error: String(err) })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`services/api listening on port ${port}`)
})
