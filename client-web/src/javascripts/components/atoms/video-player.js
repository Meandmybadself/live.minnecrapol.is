import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'

const VideoPlayer = ({ children, ...props }) => {
  const videoRef = useRef()

  useEffect(() => {
    const player = videojs(videoRef.current, {}, () => {
      console.log('onPlayeReady')
    })
    
    return () => {
      
    }
  }, [])

  return (
    <div data-vjs-player>
      <video ref={ videoRef } { ...props }>
        { children }
      </video>
    </div>
  )
}

export default VideoPlayer