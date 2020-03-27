const NodeMediaServer = require('node-media-server')

const config = require('../config')

const nms = new NodeMediaServer(config.nms)

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
  if (key !== config.streamKey) {
    session.reject()
  }
})
nms.on('postPublish', (id, StreamPath, args) => console.log('postPublish'))
nms.on('donePublish', (id, StreamPath, args) => console.log('donePublish'))
nms.on('prePlay', (id, StreamPath, args) => console.log('prePlay'))
nms.on('postPlay', (id, StreamPath, args) => console.log('postPlay'))
nms.on('donePlay', (id, StreamPath, args) => console.log('donePlay'))

nms.run()

// Poop colored shadow for night theme