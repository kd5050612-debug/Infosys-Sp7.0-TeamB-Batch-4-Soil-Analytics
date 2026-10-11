
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const pool = require('./config/db')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')

const app = express()

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())

app.use(cookieParser())
app.use('/api/auth', authRoutes)

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
