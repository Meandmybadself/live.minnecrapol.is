import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'

videojs.log.level('off')

import { useStream } from 'context/stream'

import LoadingIndicator from 'components/loading-indicator'

const Video = ({ source, onError }) => {
  const videoRef = useRef()

  useEffect(() => {
    let player = videojs(videoRef.current, { autoplay: true, preload: true, controls: true })
    console.log(source)
    player.ready(() => {
      // player.tech().on('retryplaylist', onError)

      // Use HLS but add DASH if Chrome browser detected
      let src = [ { src: `${source}.m3u8`, type: 'application/x-mpegURL' } ]
      if (videojs.browser.IS_CHROME) {
        src.unshift({ src: `${source}.mpd`, type: 'application/dash+xml' })
      }
      
      player.src(src)
      player.play()
    })

    player.on('error', onError)

    return () => {
      player.dispose()
    }
  }, [])

  return (
    <div>
      <div data-vjs-player>
        <video ref={ videoRef } className="video-js vjs-big-play-centered"></video>
      </div>
    </div>
  )
}

let count = 0;
const VideoPlayer = () => {
  const [ error, setError ] = useState(false)
  const { loading, streaming, playStreamUrl, streamingUser, setPolling } = useStream()

  useEffect(() => {
    if (error) setPolling(true)
  }, [ error ])

  useEffect(() => {
    if (streaming) {
      setError(false)
    }
  }, [ streaming ])

  const onPlayerError = e => {
    setError(true)
  }

  let overlay = null
  if (loading) {
    overlay = (
      <div className="video-player-overlay">
        <LoadingIndicator />
      </div>
    )
  } else if (!streaming) {
    overlay = (
      <div className="video-player-overlay">
        <h1>OFF-AIR</h1>
      </div>
    )
  } else if (error) {
    overlay = (
      <div className="video-player-overlay">
        <h1>PLAYBACK ERROR</h1>
      </div>
    )
  }

  const showPlayer = !loading && streaming && playStreamUrl && !error

  return (
    <div className="video-player-container">
      <div className="video-player" data-vjs-player>
        { showPlayer &&
          <Video 
            source={ playStreamUrl }
            onError={ onPlayerError }
          />
        }
      </div>

      { overlay }

      { streamingUser &&
        <div className="now-streaming">
          { `Now Streaming: @${streamingUser}` }
        </div>
      }
    </div>
  )
}

export default VideoPlayer