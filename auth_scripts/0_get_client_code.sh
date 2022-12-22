#!/bin/bash

open "https://accounts.spotify.com/authorize?response_type=code&client_id=$SPOTIFY_CLIENT_ID&scope=$SPOTIFY_SCOPE&redirect_uri=$SPOTIFY_REDIRECT_URI&state=1234"