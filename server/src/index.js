require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

// Node Media Server
const nms = require('./utilities/nms')

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

// Example hash creation
// const crypto = require('crypto')
// const d = new Date('1/1/2021')
// const t = Math.floor(d.getTime() / 1000)
// const data = `/live/stream-${t}-${config.nms.auth.secret}`
// const hash = crypto.createHash('md5').update(data).digest('hex')
// const url = `/live/stream?sign=${t}-${hash}`
// console.log(d, t, hash, url)