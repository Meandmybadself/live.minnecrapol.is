

class SpotifyClient {
    _token;
    _clientId;
    _clientSecret;
    _refreshToken;
    _deviceId;

    constructor(clientId, clientSecret, refreshToken) {
        this._clientId = clientId;
        this._clientSecret = clientSecret;
        this._refreshToken = refreshToken;
    }

    async _getDeviceId() {
        console.log('Getting device id')
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-a-users-available-devices
        const url = 'https://api.spotify.com/v1/me/player/devices';
        const response = await this._makeSpotifyRequest(url, 'GET');
        if (!response.devices?.length) {
            console.error(`No available Spotify devices to broadcast to`)
            process.exit(1)
        }
        this._deviceId = response.devices.find(device => device.name === 'minnecrapolis')?.id
        if (!this._deviceId) {
            console.error(`Could not find minnecrapolis spotify daemon.`)
            process.exit(1)
        }
        console.log('Device id set to:', this._deviceId)
        return response;
    }

    spotifyURLtoURI(url) {
        const trackIdRegex = /https:\/\/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/;
        const trackId = url.match(trackIdRegex)?.[1];
        if (!trackId) {
            console.error('Invalid Spotify track URL: ', url);
            return false
        }
        return `spotify:track:${trackId}`;
    }

    async addToQueueWithURL(url) {
        const uri = this.spotifyURLtoURI(url)
        if (uri) {
            return this.addToQueueWithURI(uri);
        }
    }

    async addToQueueWithURI(uri) {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/add-to-queue
        // https://developer.spotify.com/console/post-queue/

        // If we don't have a device ID, let's get one.
        if (!this._device) {
            await this._getDeviceId()
        }

        uri = encodeURIComponent(uri);
        const url = `https://api.spotify.com/v1/me/player/queue?uri=${uri}&device_id=${this._deviceId}`;
        const response = await this._makeSpotifyRequest(url, 'POST');
        return response;
    }

    async getQueue() {
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/get-queue
        const url = 'https://api.spotify.com/v1/me/player/queue';
        const response = await this._makeSpotifyRequest(url, 'GET');
        return response;
    }

    async startPlayback(uris) {
        // If we don't have a device ID, let's get one.
        if (!this._device) {
            await this._getDeviceId()
        }
        console.log('startPlayback', JSON.stringify(uris, null, 2))
        // https://developer.spotify.com/documentation/web-api/reference/#/operations/start-a-users-playback
        const url = `https://api.spotify.com/v1/me/player/play`
        const response = await this._makeSpotifyRequest(url, 'PUT', {
            uris
        });
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
    async _makeSpotifyRequest(url, method = 'GET', data) {
        if (!this._token) {
            await this._getSpotifyToken()
        }

        console.log(method, url, data)

        try {
            const responseOpts = {
                method,
                headers: {
                    Authorization: `Bearer ${this._token}`,
                    "Accept": "*/*",
                    "Accept-Language": "en-US,en;q=0.5",
                    'Content-Type': 'application/json'
                }
            }
            if (method !== 'GET' && data) {
                responseOpts.body = JSON.stringify(data);
            }

            const response = await fetch(url, responseOpts);
            if (!response.ok) {
                console.error('Spotify response: ', response);
                throw new Error(`${response.status} - ${response.statusText}`);
            }
            let responseData
            try {
                responseData = await response.json();
                // console.log('Spotify response: ', responseData);
            } catch (e) {
                if (response.body instanceof Function) {
                    responseData = await response.body()
                    console.log('BODY', responseData)
                } else if (response.body instanceof Function) {
                    responseData = await response.error()
                    console.log('ERROR', responseData)
                } else {
                    console.log('Unknown response in _makeSpotifyRequest', responseData)
                }
            }
            return responseData;

        } catch (e) {
            console.error('Error making Spotify request: ', e);
        }
    }
}

module.exports = SpotifyClient;