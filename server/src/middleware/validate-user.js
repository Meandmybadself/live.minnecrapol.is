const User = require('../schemas/user')

module.exports = async (request, res, next) => {
  if (!request.user) {
    const error = new Error('User does not exist')
    error.status = 401
    return next(error)
  }

  const { _id } = request.user
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

  request.user = user

  next()
}