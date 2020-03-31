import React from 'react'
import moment from 'moment'

import { useStream } from 'context/stream'

const HowToStreamScreen = () => {
  const { publishStreamUrl, publishStreamKey, expires } = useStream()

  const copyData = (data) => {
    window.navigator.clipboard.writeText(data)
  }

  console.log(expires)

  return (
    <div className="page how-to-stream-page">
      <h2 className="underline">How to Stream</h2>

      <div className="stream-data">
        <div className="stream-data-header">
          <h3>Server URL</h3>
        </div>
        <div className="copy-code">
          <p>{ publishStreamUrl }</p>
          <a onClick={ () => copyData(publishStreamUrl) }>Copy</a>
        </div>
      </div>

      <div className="stream-data">
        <div className="stream-data-header">
          <h3>Your Stream Key</h3>
          <p>Expires { moment().to(expires) }</p>
        </div>
        <div className="copy-code">
          <p>{ publishStreamKey }</p>
          <a onClick={ () => copyData(publishStreamKey) }>Copy</a>
        </div>
      </div>

      <p>More details coming soon! Check #-listening-party channel for more help in the mean time.</p>
    </div>
  )
}

export default HowToStreamScreen