const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  team_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  access_token: {
    type: String,
    required: true
  }
}, { versionKey: false })

const User = mongoose.model('User', userSchema)

module.exports = User