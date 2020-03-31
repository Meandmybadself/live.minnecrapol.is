const User = require('../schemas/user')

module.exports = async (req, res, next) => {
  if (!req.user) {
    const error = new Error('User does not exist')
    error.status = 401
    return next(error)
  }

  const { _id } = req.user
  if (!_id) {
    const error = new Error('User does not exist')
    error.status = 401
    return next(error)
  }

  const user = await User.findById(_id)
  if (!user) {
    const error = new Error('User does not exist')
    error.status = 401
    return next(error)
  }

  req.user = user

  next()
}