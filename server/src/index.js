const NodeMediaServer = require('node-media-server')

const config = require('../config')

const nms = new NodeMediaServer(config.nms)

nms.run()