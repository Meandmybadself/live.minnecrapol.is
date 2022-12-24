class SpotifyClient {
    _token;
    _clientId;
    _clientSecret;
    _refreshToken;

    constructor(clientId, clientSecret, refreshToken) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._refreshToken = refreshToken;
    }

    async addToQueueWithURL(url) {
        const trackIdRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const trackId = url.match(trackIdRegex)?.[1];
        if (!trackId) {
            console.error('Invalid Spotify track URL: ', url);
            return false
        }
        const uri = `spotify:track:${trackId}`;
        return this.addToQueueWithURI(uri);
    }

    async addToQueueWithURI(uri) {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-to-queue
        const url = `https://api.spotify.com/v1/me/player/queue?uri=${uri}`;
        const response = await this._makeSpotifyRequest(url, 'POST');
        return response;
    }

    async getQueue() {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-queue
        const url = 'https://api.spotify.com/v1/me/player/queue';
        const response = await this._makeSpotifyRequest(url, 'GET');
        return response;
    }

    async startPlayback() {
        // https://developer.spotify.com/documentation/web  -api/reference/#/operations/start-a-users-playback
        const url = 'https://api.spotify.com/v1/me/player/play';
        const response = await this._makeSpotifyRequest(url, 'PUT');
        return response;
    }

    async getPlaybackState() {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-information-about-the-users-current-playback
        const url = 'https://api.spotify.com/v1/me/player';
        return this._makeSpotifyRequest(url, 'GET');
        return response
    }

    async isPlaying() {
        const playbackState = await this.getPlaybackState();
        return playbackState.status !== 204
    }

    async _getSpotifyToken() {
        const data = {
            grant_type: 'refresh_token',
            refresh_token: this._refreshToken,
            client_id: this._clientId,
            client_secret: this._clientSecret
        };

        const body = new URLSearchParams();
        Object.keys(data).forEach(prop => {
            body.set(prop, data[prop]);
        });

        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body
            });

            const responseJSON = await response.json();
            this._token = responseJSON.access_token;
        } catch (e) {
            console.error('Error getting Spotify token: ', e);
        }
    }

    // Make Spotify API request with authentication token.
    async _makeSpotifyRequest(url, method = 'GET') {
        if (!this._token) {
            await this._getSpotifyToken();
        }

        console.log(method, url);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${this._token}`,
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`${response.status} - ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Spotify response: ', data);
            return data;
        } catch (e) {
            console.error('Error making Spotify request: ', e);
        }
    }
}

module.exports = SpotifyClient;
