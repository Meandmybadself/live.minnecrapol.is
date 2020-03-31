import React from 'react'

import AuthProvider from 'context/auth'
import ThemeProvider from 'context/theme'

import Routers from 'routers'

const MinnecrapolisLive = () => (
  <ThemeProvider>
    <AuthProvider>
      <Routers />
    </AuthProvider>
  </ThemeProvider>
)

export default MinnecrapolisLive