const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const StreamKey = require('../schemas/stream-key')
const nms = require('../utilities/nms')

const { MINNE_LIVE_PUBLISH_HOST, MINNE_LIVE_PUBLISH_PORT, MINNE_LIVE_PLAY_HOST,
  MINNE_LIVE_PLAY_PORT, MINNE_LIVE_PLAY_NEEDS_PORT, MINNE_LIVE_STREAM_KEY, MINNE_LIVE_AUTH_SECRET } = process.env

const playStreamUrl = !MINNE_LIVE_PLAY_NEEDS_PORT ?
  `${MINNE_LIVE_PLAY_HOST}/live/${MINNE_LIVE_STREAM_KEY}/index` :
  `${MINNE_LIVE_PLAY_HOST}:${MINNE_LIVE_PLAY_PORT}/live/${MINNE_LIVE_STREAM_KEY}/index`

// Make sure the files needed for playback are ready for client
const streamFilesReady = async () => {
  let ready = false

  ready = await new Promise(resolve => {
    fs.stat(path.resolve(__dirname, '../../media/live/stream/index.mpd'), (error, stats) => {
      resolve(!error)
    })
  })

  return ready
}

const streamDataForStreamKey = async (streamKey) => {
  const ready = await streamFilesReady()
  const session = nms.getSession(nms.currentSessionId)
  const streaming = !!session && ready

  let streamingUser = null
  if (streaming) {
    const streamKey = await StreamKey.findOne({ sign: session.publishArgs.sign }).populate('user')
    if (streamKey) {
      streamingUser = streamKey.user.display_name
    }
  }

  return {
    playStreamUrl,
    publishStreamUrl: `${MINNE_LIVE_PUBLISH_HOST}:${MINNE_LIVE_PUBLISH_PORT}/live`,
    publishStreamKey: `${MINNE_LIVE_STREAM_KEY}?sign=${streamKey.sign}`,
    expires: streamKey.expires,
    streaming,
    streamingUser
  }
}

exports.getStreamDataForUser = async (user, forceRenew = false) => {
  const existingKey = await StreamKey.findOne({ user: user._id })

  if (existingKey) {
    if (forceRenew || existingKey.expires <= new Date()) {
      // Expired key, delete
      await StreamKey.findByIdAndDelete(existingKey._id)
    } else {
      // Not expired key, return it
      return await streamDataForStreamKey(existingKey)
    }
  }

  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // one week.

  const expiresSeconds = Math.floor(expires.getTime() / 1000)
  const hashData = `/live/${MINNE_LIVE_STREAM_KEY}-${expiresSeconds}-${MINNE_LIVE_AUTH_SECRET}`
  const hash = crypto.createHash('md5').update(hashData).digest('hex')
  const sign = `${expiresSeconds}-${hash}`

  // New key expiring in 1 day
  const streamKey = await StreamKey.create({ user: user._id, sign, expires })

  return await streamDataForStreamKey(streamKey)
}

exports.getPublicStreamData = async () => {
  const ready = await streamFilesReady()
  const session = nms.getSession(nms.currentSessionId)
  const streaming = !!session && ready

  let streamingUser = null
  if (streaming) {
    const streamKey = await StreamKey.findOne({ sign: session.publishArgs.sign }).populate('user')
    if (streamKey) {
      streamingUser = streamKey.user.display_name
    }
  }

  return {
    playStreamUrl,
    publishStreamUrl: null,
    publishStreamKey: null,
    expires: null,
    streaming,
    streamingUser
  }
}