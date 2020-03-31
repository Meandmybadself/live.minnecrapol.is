const express = require('express')

const AuthController = require('../../controllers/auth')

const router = express.Router()

router.post('/slack', async (req, res, next) => {
  try {
    const data = await AuthController.signInWithSlack(req.body.code)

    return res.json(data)
  } catch (error) {
    console.error('Error signing in with Slack', error)

    error.status = 401

    return next(error)
  }
})

router.use(require('../../middleware/validate-jwt'))

router.post('/refresh', async (req, res, next) => {
  try {
    const data = await AuthController.refresh(req.user)

    return res.json(data)
  } catch (error) {
    console.error('Error refreshing auth with token', error)

    error.status = 401

    return next(error)
  }
})

module.exports = router