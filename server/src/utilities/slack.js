const { WebClient } = require('@slack/web-api')

const SlackWebClient = new WebClient(process.env.MINNE_LIVE_SLACK_TOKEN)

exports.SlackWebClient = SlackWebClient