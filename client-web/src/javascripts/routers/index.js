import React from 'react'

import { useAuth } from 'context/auth'
import { useTheme } from 'context/theme'

import UnauthenticatedRouter from 'routers/unauthenticated-router'
import AuthenticatedRouter from 'routers/authenticated-router'

const Routers = () => {
  const { user } = useAuth()
  const { dark } = useTheme()

  return (
    <div id="app" className={ dark ? 'dark' : 'light' }>
      { user ?
        <AuthenticatedRouter /> :
        <UnauthenticatedRouter />  
      }
    </div>
  )
}

export default Routers