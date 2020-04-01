const { WebClient } = require('@slack/web-api')

const SlackOAuthWebClient = new WebClient(process.env.MINNE_LIVE_SLACK_TOKEN)
const SlackBotWebClient = new WebClient(process.env.MINNE_LIVE_SLACK_BOT_TOKEN)

exports.SlackOAuthWebClient = SlackOAuthWebClient
exports.SlackBotWebClient = SlackBotWebClient