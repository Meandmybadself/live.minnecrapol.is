import React, { useState } from 'react'
import { ThemeProvider } from 'styled-components'

import GlobalStyles from '../../stylesheets/global-styles'
import { lightTheme, darkTheme } from 'utilities/theme'

import Header from 'molecules/header'
import HomePage from 'templates/home-page'

const MinnecrapolisLive = () => {
  const [ dark, setDark ] = useState(true)

  return (
    <ThemeProvider theme={ dark ? darkTheme : lightTheme }>
      <GlobalStyles />
      <div id="app">
        <Header
          dark={ dark }
          toggleTheme={ () => setDark(!dark) }
        />
        
        <div className="page-container">
          <HomePage />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default MinnecrapolisLive