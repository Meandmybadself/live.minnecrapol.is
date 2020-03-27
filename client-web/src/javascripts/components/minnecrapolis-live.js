import React, { useState } from 'react'

import Header from 'components/header'
import HomePage from 'components/home-page'

const MinnecrapolisLive = () => {
  const [ dark, setDark ] = useState(true)

  return (
    <div id="app" className={ !dark && 'light' }>
      <Header
        dark={ dark }
        toggleTheme={ () => setDark(!dark) }
      />
      
      <div className="page-container">
        <HomePage />
      </div>
    </div>
  )
}

export default MinnecrapolisLive