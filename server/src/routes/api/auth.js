const express = require('express')

const AuthController = require('../../controllers/auth')

const router = express.Router()

router.post('/slack', async (request, res, next) => {
  try {
    const data = await AuthController.signInWithSlack(request.body.code, request.body.redirect_uri)

    return res.json(data)
  } catch (error) {
    console.error('Error signing in with Slack', error)

    error.status = 401

    return next(error)
  }
})

router.use(require('../../middleware/validate-jwt'))
router.use(require('../../middleware/validate-user'))

router.post('/refresh', async (request, res, next) => {
  try {
    const data = await AuthController.refresh(request.user)

    return res.json(data)
  } catch (error) {
    console.error('Error refreshing auth with token', error)

    error.status = 401

    return next(error)
  }
})

module.exports = router