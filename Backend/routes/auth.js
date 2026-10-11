
const express = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
const rateLimit = require('express-rate-limit')
const { sendOtpEmail } = require('../config/mailer')

const router = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
})

function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString()
}

function sendToken(res, user, status = 200, message) {
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  )

  res.cookie('agrisync_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  })

  return res.status(status).json({
    message: message || (
      status === 201
        ? 'Email verified and account created successfully'
        : 'Signed in successfully'
    ),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })
}

router.post('/signup', authLimiter, async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Please provide valid details',
      })
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2 || cleanName.length > 100) {
      return res.status(400).json({
        message: 'Name must be 2–100 characters',
      })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        message: 'Enter a valid email address',
      })
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: 'Password must be 8–72 characters long',
      })
    }

    const [existing] = await pool.execute(
      'SELECT id, email_verified FROM users WHERE email = ?',
      [cleanEmail],
    )

    if (existing.length && existing[0].email_verified) {
      return res.status(409).json({
        message: 'An account with this email already exists. Please sign in.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const otp = generateOtp()
    const otpHash = hashOtp(otp)

    await pool.execute(
      'DELETE FROM email_otps WHERE email = ?',
      [cleanEmail],
    )

    await pool.execute(
      `INSERT INTO email_otps
       (email, otp_hash, expires_at, attempts, pending_name, pending_password_hash)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE), 0, ?, ?)`,
      [cleanEmail, otpHash, cleanName, passwordHash],
    )

    try {
      await sendOtpEmail(cleanEmail, otp)
    } catch (emailError) {
      await pool.execute(
        'DELETE FROM email_otps WHERE email = ?',
        [cleanEmail],
      )

      console.error('OTP email error:', emailError.message)

      return res.status(502).json({
        message: 'Unable to send verification email. Please try again.',
      })
    }

    return res.status(200).json({
      message: 'Verification code sent to your email',
      requiresVerification: true,
      email: cleanEmail,
    })
  } catch (error) {
    console.error('Signup error:', error.message)

    return res.status(500).json({
      message: 'Unable to start registration',
    })
  }
})

router.post('/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { email, otp } = req.body

    if (
      typeof email !== 'string' ||
      typeof otp !== 'string' ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        message: 'Enter your email and six-digit verification code',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    const [rows] = await pool.execute(
      `SELECT id, otp_hash, expires_at, attempts,
              pending_name, pending_password_hash
       FROM email_otps
       WHERE email = ?
       LIMIT 1`,
      [cleanEmail],
    )

    if (!rows.length) {
      return res.status(400).json({
        message: 'Code expired or not found. Please sign up again.',
      })
    }

    const record = rows[0]

    if (record.attempts >= 5) {
      await pool.execute(
        'DELETE FROM email_otps WHERE id = ?',
        [record.id],
      )

      return res.status(429).json({
        message: 'Too many incorrect attempts. Please sign up again.',
      })
    }

    if (new Date(record.expires_at).getTime() <= Date.now()) {
      await pool.execute(
        'DELETE FROM email_otps WHERE id = ?',
        [record.id],
      )

      return res.status(400).json({
        message: 'Verification code expired. Please sign up again.',
      })
    }

    if (hashOtp(otp) !== record.otp_hash) {
      await pool.execute(
        'UPDATE email_otps SET attempts = attempts + 1 WHERE id = ?',
        [record.id],
      )

      return res.status(400).json({
        message: 'Incorrect verification code',
      })
    }

    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      const [existing] = await connection.execute(
        `SELECT id, name, email, email_verified
         FROM users
         WHERE email = ?
         FOR UPDATE`,
        [cleanEmail],
      )

      if (existing.length && existing[0].email_verified) {
        await connection.execute(
          'DELETE FROM email_otps WHERE id = ?',
          [record.id],
        )

        await connection.commit()

        return res.status(409).json({
          message: 'This account is already verified. Please sign in.',
        })
      }

      let user

      if (existing.length) {
        await connection.execute(
          `UPDATE users
           SET name = ?, password_hash = ?, email_verified = TRUE
           WHERE id = ?`,
          [
            record.pending_name,
            record.pending_password_hash,
            existing[0].id,
          ],
        )

        user = {
          id: existing[0].id,
          name: record.pending_name,
          email: cleanEmail,
        }
      } else {
        const [result] = await connection.execute(
          `INSERT INTO users
           (name, email, password_hash, email_verified)
           VALUES (?, ?, ?, TRUE)`,
          [
            record.pending_name,
            cleanEmail,
            record.pending_password_hash,
          ],
        )

        user = {
          id: result.insertId,
          name: record.pending_name,
          email: cleanEmail,
        }
      }

      await connection.execute(
        'DELETE FROM email_otps WHERE id = ?',
        [record.id],
      )

      await connection.commit()

      return sendToken(
        res,
        user,
        existing.length ? 200 : 201,
        'Email verified successfully. You are now signed in.',
      )
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('OTP verification error:', error.message)

    return res.status(500).json({
      message: 'Unable to verify your email right now',
    })
  }
})

router.post('/signin', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      email.length > 255 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: 'Please enter a valid email and password',
      })
    }

    const cleanEmail = email.trim().toLowerCase()

    const [users] = await pool.execute(
      `SELECT id, name, email, password_hash, email_verified
       FROM users
       WHERE email = ?`,
      [cleanEmail],
    )

    if (!users.length || !users[0].password_hash) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    const user = users[0]

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash,
    )

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password',
      })
    }

    if (!user.email_verified) {
      return res.status(403).json({
        message: 'Please verify your email before signing in',
      })
    }

    return sendToken(res, user)
  } catch (error) {
    console.error('Signin error:', error.message)

    return res.status(500).json({
      message: 'Unable to sign in',
    })
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('agrisync_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })

  return res.json({
    message: 'Signed out successfully',
  })
})

module.exports = router
