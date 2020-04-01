const NodeMediaServer = require('node-media-server')

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
    ffmpeg: process.env.NODE_ENV === 'development' ? '/usr/local/bin/ffmpeg' : '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: false,
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
nms.on('prePublish', (id, StreamPath, args) => {
  console.log('prePublish')

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
  }
})
nms.on('postPublish', (id, StreamPath, args) => console.log('postPublish'))
nms.on('donePublish', (id, StreamPath, args) => console.log('donePublish'))
nms.on('prePlay', (id, StreamPath, args) => console.log('prePlay'))
nms.on('postPlay', (id, StreamPath, args) => console.log('postPlay'))
nms.on('donePlay', (id, StreamPath, args) => console.log('donePlay'))

nms.run()