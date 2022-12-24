require('dotenv').config()
const SpotifyClient = require('./utilities/spotify')
const spotifyClient = new SpotifyClient(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET, process.env.SPOTIFY_REFRESH_TOKEN)

const spotifyUrls = [
    'https://open.spotify.com/track/3Qm86XLflmIXVm1wcwkgDK',
    'https://open.spotify.com/track/1XNE0QfNjdroSdosMIk8F6?si=0df65df6c8324bef'
]

async function main() {
    const response = await spotifyClient.addToQueueWithURL(spotifyUrls[0])
    console.log('response', response)
}
main()
