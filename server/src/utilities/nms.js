const NodeMediaServer = require('node-media-server')
const { WebClient } = require('@slack/web-api')
const StreamKey = require('../schemas/stream-key')
const web = new WebClient(process.env.MINNE_LIVE_SLACK_BOT_TOKEN)

const lookupUserWithStreamKeySig = async (sign) => {
  // Look up user with stream key signature.
  const userLookup = await StreamKey.aggregate()
    .match({ sign })
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    })
    .unwind('$user')

  if (userLookup.length) {
    return userLookup[0].user
  }
}

const config = {
  rtmp: {
    port: process.env.MINNE_LIVE_PUBLISH_PORT,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  auth: {
    play: false,
    publish: true,
    secret: process.env.MINNE_LIVE_AUTH_SECRET
  },
  http: {
    port: process.env.MINNE_LIVE_PLAY_PORT,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg:
      process.env.NODE_ENV === 'development'
        ? '/usr/local/bin/ffmpeg'
        : '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
}

module.exports = nms = new NodeMediaServer(config)

nms.on('preConnect', (id, args) => console.log('preConnect'))
nms.on('postConnect', (id, args) => console.log('postConnect'))
nms.on('doneConnect', (id, args) => {
  console.log('doneConnect')

  if (nms.currentSessionId === id) {
    nms.currentSessionId = undefined
  }
})
nms.on('prePublish', async (id, StreamPath, { sign }) => {
  console.log('prePublish', sign)

  // DOES PRE PUBLISH HAPPEN EVEN IF SOMEONE IS ALREADY STREAMING?
  // SHOULDN'T SET THIS IF SO, IT SHOULD BE THE ACTIVE STREAMER
  const session = nms.getSession(id)

  const parts = StreamPath.split('/')
  const key = parts[parts.length - 1].trim()

  // Only allowing a single stream right now,
  // check if this matches our streamKey
  if (key !== process.env.MINNE_LIVE_STREAM_KEY) {
    session.reject()
  } else {
    nms.currentSessionId = id

    const user = await lookupUserWithStreamKeySig(sign)
    if (user) {
      await web.chat.postMessage({
        text: `${user.display_name} (${user.name}) has started a new stream.`,
        channel: process.env.MINNE_LIVE_CHANNEL_ID,
        attachments: [
          {
            title: '🎧  Listen here  🎧',
            title_link: 'https://live.minnecrapol.is/'
          }
        ]
      })
    }
  }
})
nms.on('postPublish', (id, StreamPath, args) => console.log('postPublish'))
nms.on('donePublish', async (id, StreamPath, { sign }) => {
  const user = await lookupUserWithStreamKeySig(sign)
  if (user) {
    await web.chat.postMessage({
      text: `${user.display_name} (${user.name}) has stopped streaming.`,
      channel: process.env.MINNE_LIVE_CHANNEL_ID
    })
  }
})
nms.on('prePlay', (id, StreamPath, args) => console.log('prePlay'))
nms.on('postPlay', (id, StreamPath, args) => console.log('postPlay'))
nms.on('donePlay', (id, StreamPath, args) => console.log('donePlay'))

nms.run()
