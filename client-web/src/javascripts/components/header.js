import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from 'context/auth'
import { useTheme } from 'context/theme'

import logo from 'images/crappy-logo.png'

export const Header = () => {
  const { user, signOut } = useAuth()
  const { dark, toggleDark } = useTheme()
  const location = useLocation()

  let howToStreamLink
  if (location.pathname === '/how-to-stream') {
    howToStreamLink = (
      <a className="active">How to Stream</a>
    )
  } else {
    howToStreamLink = (
      <Link to="/how-to-stream">How to Stream</Link>
    )
  }

  return (
    <header>
      <img className="logo" src={ logo } />
      <h1>MINNECRAPOLIS LIVE!</h1>

      { !user &&
        <Link to="/sign-in">Sign In</Link>
      }

      { user &&
        <>
          { howToStreamLink }
          <a onClick={ signOut }>Sign Out</a>
        </>
      }

      <a onClick={ toggleDark }>{ !dark ? 'Dark' : 'Light' }</a>
    </header>
  )
}

export default Header