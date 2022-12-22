class SpotifySlackClient {
    constructor(
        spotifyClient,
        // private readonly slackClient: SlackClient
    ) {

    }

    async consumeMessage(message) {
        // Parse the URL from the message.
        const urlRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const url = message.match(urlRegex)?.[0];
        if (!url) {
            console.error('Invalid Spotify track URL: ', url);
            return;
        }
        // Add the track to the queue.
        const addedToQueue = await this.spotifyClient.addToQueueWithURL(url);
        if (!addedToQueue) {
            console.error('Failed to add track to queue');
            return;
        }
        // Is the track playing?
        const isPlaying = await this.spotifyClient.isPlaying();
        if (!isPlaying) {
            // Start playback.
            await this.spotifyClient.startPlayback();
        }

        // TODO - Set an emoji reaction on the message.

    }

}

export default SpotifySlackClient;