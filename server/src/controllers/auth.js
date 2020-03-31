const jwt = require('jsonwebtoken')

const User = require('../schemas/user')
const { SlackWebClient } = require('../utilities/slack')

exports.signInWithSlack = async (code, redirect_uri) => {
  const oAuthResponse = await SlackWebClient.oauth.access({
    client_id: process.env.MINNE_LIVE_SLACK_CLIENT_ID,
    client_secret: process.env.MINNE_LIVE_SLACK_CLIENT_SECRET,
    code,
    redirect_uri
  })

  const userData = {
    user_id: oAuthResponse.user_id,
    team_id: oAuthResponse.team_id,
    name: oAuthResponse.user.name,
    avatar: oAuthResponse.user.image_1024,
    access_token: oAuthResponse.access_token
  }

  const user = await User.findOneAndUpdate({ user_id: userData.user_id }, userData, { new: true, upsert: true, setDefaultsOnInsert: true })
  const token = jwt.sign({ _id: user._id }, process.env.MINNE_LIVE_JWT_SECRET, { expiresIn: "30d" })

  return {
    user: {
      name: user.name,
      avatar: user.avatar
    },
    token
  }
}

exports.refresh = async (user) => {
  const token = jwt.sign({ _id: user._id }, process.env.MINNE_LIVE_JWT_SECRET, { expiresIn: "30d" })

  return {
    user: {
      name: user.name,
      avatar: user.avatar
    },
    token
  }
}