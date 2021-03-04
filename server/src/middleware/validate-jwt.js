const jwt = require('jsonwebtoken')

module.exports = (request, res, next) => {
  const { headers } = request
  if (!headers) {
    const error = new Error('Authorization header not provided')
    error.status = 401
    return next(error)
  }

  const { authorization } = headers
  if (!authorization) {
    const error = new Error('Authorization header not provided')
    error.status = 401
    return next(error)
  }

  const parts = authorization.split(' ')
  if (parts.length !== 2) {
    const error = new Error('Authorizaton header malformed')
    error.status = 401
    return next(error)
  }

  const token = parts[1]
  try {
    const decoded = jwt.verify(token, process.env.MINNE_LIVE_JWT_SECRET, { ignoreExpiration: true })

    request.user = { _id: decoded._id }

    next()
  } catch (error) {
    error.status = 401
    return next(error)
  }
}