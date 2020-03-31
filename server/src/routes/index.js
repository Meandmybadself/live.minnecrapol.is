const express = require('express')
const path = require('path')

const router = express.Router()

router.use('/api', require('./api'))

// Send single page app for all other non-matching GET requests
router.get('*', (_, res) => res.sendFile(path.resolve(__dirname, '../../../client-web/dist/index.html')))

module.exports = router