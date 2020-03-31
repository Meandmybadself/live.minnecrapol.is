const express = require('express')

const StreamDataController = require('../../controllers/stream-data')

const router = express.Router()

router.use(require('../../middleware/validate-jwt'))
router.use(require('../../middleware/validate-user'))

router.get('/me', async (req, res, next) => {
  try {
    const data = await StreamDataController.getStreamDataForUser(req.user)

    return res.json(data)
  } catch (error) {
    console.error('Error getting stream data', error)

    error.status = 401

    return next(error)
  }
})

module.exports = router