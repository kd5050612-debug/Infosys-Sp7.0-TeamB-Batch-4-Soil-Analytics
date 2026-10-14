
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const communityRoutes = require('./routes/community')

const app = express()
const frontendOrigin = process.env.FRONTEND_URL || 'http://localhost:5173'
const frontendOrigins = [frontendOrigin]
const frontendUrl = new URL(frontendOrigin)
if (frontendUrl.hostname === 'localhost' || frontendUrl.hostname === '127.0.0.1') {
  frontendUrl.hostname = frontendUrl.hostname === 'localhost' ? '127.0.0.1' : 'localhost'
  frontendOrigins.push(frontendUrl.origin)
}

app.use(cors({
  origin: frontendOrigins,
  credentials: true
}))

app.use(express.json({ limit: '4mb' }))

app.use(cookieParser())
app.use('/api/auth', authRoutes)
app.use('/api/community', communityRoutes)

app.get('/api/health', (req, res) => {
  res.json({ message: 'AgriSync API is running' })
})

app.get('/api/db-check', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DATABASE() AS database_name')
    res.json({
      message: 'MySQL connected successfully',
      database: rows[0].database_name
    })
  } catch (error) {
    console.error('Database connection failed:', error.message)
    res.status(500).json({ message: 'Database connection failed' })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`AgriSync API running at http://localhost:${PORT}`)
})
