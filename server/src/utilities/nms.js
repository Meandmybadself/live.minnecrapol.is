const NodeMediaServer = require('node-media-server')

const config = {
  rtmp: {
    port: 1935,
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
    port: 8420,
    allow_origin: '*',
    mediaroot: './media'
  },
  trans: {
    ffmpeg: process.env.NODE_ENV === 'development' ? '/usr/local/bin/ffmpeg' : '/usr/bin/ffmpeg',
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

const nms = new NodeMediaServer(config)

nms.on('preConnect', (id, args) => console.log('preConnect'))
nms.on('postConnect', (id, args) => console.log('postConnect'))
nms.on('doneConnect', (id, args) => console.log('doneConnect'))
nms.on('prePublish', (id, StreamPath, args) => {
  console.log('prePublish')

  const session = nms.getSession(id)

  const parts = StreamPath.split('/')
  const key = parts[parts.length - 1].trim()

  // Only allowing a single stream right now,
  // check if this matches our streamKey
  if (key !== process.env.MINNE_LIVE_STREAM_KEY) {
    session.reject()
  }
})
nms.on('postPublish', (id, StreamPath, args) => console.log('postPublish'))
nms.on('donePublish', (id, StreamPath, args) => console.log('donePublish'))
nms.on('prePlay', (id, StreamPath, args) => console.log('prePlay'))
nms.on('postPlay', (id, StreamPath, args) => console.log('postPlay'))
nms.on('donePlay', (id, StreamPath, args) => console.log('donePlay'))

nms.run()

module.exports = nms