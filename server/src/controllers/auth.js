const jwt = require('jsonwebtoken')

const User = require('../schemas/user')
const { SlackOAuthWebClient, SlackBotWebClient } = require('../utilities/slack')

exports.signInWithSlack = async (code, redirect_uri) => {
  const oAuthResponse = await SlackOAuthWebClient.oauth.v2.access({
    client_id: process.env.MINNE_LIVE_SLACK_CLIENT_ID,
    client_secret: process.env.MINNE_LIVE_SLACK_CLIENT_SECRET,
    code,
    redirect_uri
  })

  const userInfoResponse = await SlackBotWebClient.users.info({ user: oAuthResponse.authed_user.id })
  
  const { id: user_id, team_id, profile } = userInfoResponse.user

  const userData = {
    user_id,
    team_id,
    name: profile.real_name_normalized,
    display_name: profile.display_name,
    avatar: profile.image_1024,
    access_token: oAuthResponse.authed_user.access_token
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