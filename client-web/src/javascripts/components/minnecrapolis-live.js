import React from 'react'

import AuthProvider from 'context/auth'
import ThemeProvider from 'context/theme'
import StreamProvider from 'context/stream'

import Routers from 'routers'

const MinnecrapolisLive = () => (
  <ThemeProvider>
    <AuthProvider>
      <StreamProvider>
        <Routers />
      </StreamProvider>
    </AuthProvider>
  </ThemeProvider>
)

export default MinnecrapolisLive