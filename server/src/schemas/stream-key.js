const mongoose = require('mongoose')

const streamKeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Only allow one stream key per user?
  },
  sign: {
    type: String,
    required: true
  },
  expires: {
    type: Date,
    required: true
  }
}, { versionKey: false })

streamKeySchema.virtual('expired').get(function() {
  return this.expires <= new Date()
})

streamKeySchema.static('findBySign', function(sign) {
  return this.findOne({ sign }).populate('user')
})

const StreamKey = mongoose.model('StreamKey', streamKeySchema)

module.exports = StreamKey