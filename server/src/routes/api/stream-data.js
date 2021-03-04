const express = require('express')

const StreamDataController = require('../../controllers/stream-data')

const router = express.Router()

router.get('/', async (request, res, next) => {
  try {
    const data = await StreamDataController.getPublicStreamData()

    return res.json(data)
  } catch (error) {
    console.error('Error getting stream data', error)

    error.status = 500

    return next(error)
  }
})

router.use(require('../../middleware/validate-jwt'))
router.use(require('../../middleware/validate-user'))

router.get('/me', async (request, res, next) => {
  try {
    const data = await StreamDataController.getStreamDataForUser(request.user, request.query.renew === 'true')

    return res.json(data)
  } catch (error) {
    console.error('Error getting stream data', error)

    error.status = 500

    return next(error)
  }
})

module.exports = router