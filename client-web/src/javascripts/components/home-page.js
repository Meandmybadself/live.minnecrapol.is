import React from 'react'

import VideoPlayer from 'components/video-player'

const HomePage = () => {
  return (
    <div className="page home-page">
      <VideoPlayer
        type="application/x-mpegURL"
        controls
        autoPlay
      >
        <source src={ STREAM_URL } type="application/x-mpegURL" />
      </VideoPlayer>
    </div>
  )
}

export default HomePage