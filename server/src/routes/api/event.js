const express = require('express')
const SpotifyClient = require('../utilities/spotify')
const spotifyClient = new SpotifyClient(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, process.env.SPOTIFY_REFRESH_TOKEN)

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
            // Parse open spotify urls and add them to the queue.
            const spotifyUrls = event.text.match(/https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+/g)
            if (spotifyUrls) {
                // Add the songs to the queue.
                const songs = await Promise.all(spotifyUrls.map(async (url) => {
                    const response = await spotifyClient.addToQueueWithURL(url)
                    return response
                }))
                console.log(songs)
            }
        }
    }
})
