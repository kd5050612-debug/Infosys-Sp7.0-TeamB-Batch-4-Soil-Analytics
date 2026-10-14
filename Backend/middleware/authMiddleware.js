const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {
  const token = req.cookies?.agrisync_token

  if (!token) {
    return res.status(401).json({ message: 'Sign in to use the farmer community.' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload.id) {
      return res.status(401).json({ message: 'Your session is invalid. Please sign in again.' })
    }

    req.user = { id: payload.id, email: payload.email }
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
    }

    console.error('Community authentication error:', error.message)
    return res.status(500).json({ message: 'Unable to verify your session.' })
  }
}

module.exports = authenticate