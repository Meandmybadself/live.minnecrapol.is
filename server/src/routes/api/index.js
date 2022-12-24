const express = require('express')

const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/stream-data', require('./stream-data'))
router.use('/event', require('./event'))

module.exports = router