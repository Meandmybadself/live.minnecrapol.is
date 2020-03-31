import React from 'react'

import { useAuth } from 'context/auth'
import { useTheme } from 'context/theme'

import UnauthenticatedRouter from 'routers/unauthenticated-router'
import AuthenticatedRouter from 'routers/authenticated-router'

import Header from 'components/header'

const Routers = () => {
  const { user } = useAuth()
  const { dark } = useTheme()

  return (
    <div id="app" className={ dark ? 'dark' : 'light' }>

      <Header />

      <div className="page-container">
        { user ?
          <AuthenticatedRouter /> :
          <UnauthenticatedRouter />  
        }
      </div>

    </div>
  )
}

export default Routers