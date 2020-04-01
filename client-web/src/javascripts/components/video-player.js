import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'dashjs'
import 'videojs-contrib-dash'

videojs.log.level('off')

import { useStream } from 'context/stream'

import LoadingIndicator from 'components/loading-indicator'

const Video = ({ source, onError }) => {
  const videoRef = useRef()

  useEffect(() => {
    let player = videojs(videoRef.current, { controls: true })

    player.ready(() => {
      player.src({
        src: source,
        type: 'application/dash+xml'
      })

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

const VideoPlayer = () => {
  const [ error, setError ] = useState(false)
  const { loading, streaming, playStreamUrl, setPolling } = useStream()

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
    </div>
  )
}

export default VideoPlayer