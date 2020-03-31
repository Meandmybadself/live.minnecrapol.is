const crypto = require('crypto')

const StreamKey = require('../schemas/stream-key')
const nms = require('../utilities/nms')

const { MINNE_LIVE_PUBLISH_HOST, MINNE_LIVE_PUBLISH_PORT, MINNE_LIVE_PLAY_HOST,
  MINNE_LIVE_PLAY_PORT, MINNE_LIVE_STREAM_KEY, MINNE_LIVE_AUTH_SECRET } = process.env

const streamDataForStreamKey = (streamKey) => {
  return {
    playStreamUrl: `${MINNE_LIVE_PLAY_HOST}:${MINNE_LIVE_PLAY_PORT}/live/${MINNE_LIVE_STREAM_KEY}/index.m3u8`,
    publishStreamUrl: `${MINNE_LIVE_PUBLISH_HOST}:${MINNE_LIVE_PUBLISH_PORT}/live`,
    publishStreamKey: `${MINNE_LIVE_STREAM_KEY}?sign=${streamKey.sign}`,
    expires: streamKey.expires,
    streaming: !!nms.getSession(nms.currentSessionId)
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
      return streamDataForStreamKey(existingKey)
    }
  }

  const expires = new Date()
  expires.setDate(expires.getDate() + 1)
  
  const expiresSeconds = Math.floor(expires.getTime() / 1000)
  const hashData = `/live/${MINNE_LIVE_STREAM_KEY}-${expiresSeconds}-${MINNE_LIVE_AUTH_SECRET}`
  const hash = crypto.createHash('md5').update(hashData).digest('hex')
  const sign = `${expiresSeconds}-${hash}`

  // New key expiring in 1 day
  const streamKey = await StreamKey.create({ user: user._id, sign, expires })

  return streamDataForStreamKey(streamKey)
}