require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const fs = require('fs-extra')
const path = require('path')

// Empty the directory that holds the temp video files on start
fs.emptyDirSync(path.resolve(__dirname, '../media/live/stream'))

// Node Media Server
require('./utilities/nms')

// MongoDB
mongoose.set('useFindAndModify', false)
mongoose.connect(process.env.MINNE_LIVE_MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// Express Server
const app = express()
app.use(require('body-parser').json())
app.use(require('cors')())
app.use(express.static(path.resolve(__dirname, '../../client-web/dist'), { index: false }))

app.use(require('./routes'))
app.listen(process.env.MINNE_LIVE_HTTP_PORT, () => {
  console.log('HTTP server listening on port ' + process.env.MINNE_LIVE_HTTP_PORT)
})