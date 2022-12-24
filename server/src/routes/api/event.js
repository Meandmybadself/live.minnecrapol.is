const express = require('express')

const router = express.Router()

router.post('/', async (req, res, next) => {
    // This is a Slack event.
    const { body } = req
    if (body.type === 'url_verification') {
        // This is a challenge to verify the Slack app.
        return res.json({ challenge: body.challenge })
    }

    if (body.type === 'event_callback') {
        // This is an event from Slack.
        const { event } = body
        if (event.type === 'app_mention') {
            // Parse Spotify URLs out of the message.

        }
    }
})

module.exports = router