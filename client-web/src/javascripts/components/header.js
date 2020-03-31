import React from 'react'

import { useAuth } from 'context/auth'
import { useTheme } from 'context/theme'

import logo from 'images/crappy-logo.png'

export const Header = () => {
  const { user, signOut } = useAuth()
  const { dark, toggleDark } = useTheme()

  const onHowToStreamClick = () => { }

  return (
    <header>
      <img className="logo" src={ logo } />
      <h1>MINNECRAPOLIS LIVE!</h1>

      { user &&
        <>
          <a onClick={ onHowToStreamClick }>How to Stream</a>
          <a onClick={ signOut }>Sign Out</a>
        </>
      }
      <a onClick={ toggleDark }>{ !dark ? 'Dark' : 'Light' }</a>
    </header>
  )
}

export default Header