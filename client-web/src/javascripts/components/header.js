import React, { useState } from 'react'
import { Link, useLocation, useHistory, useRouteMatch } from 'react-router-dom'

import { useAuth } from 'context/auth'
import { useTheme } from 'context/theme'

import logo from 'images/crappy-logo.png'

const NavLink = ({ to, className, onNavigate = () => {}, children }) => {
  const history = useHistory()
  const match = useRouteMatch({ path: to, exact: true })

  const onClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!match) {
      history.push(to)

      onNavigate()
    }
  }

  return (
    <a
      href={ to }
      className={ `${className} ${match ? 'active' : ''}` }
      onClick={ onClick }
    >
      { children }
    </a>
  )
}

export const Header = () => {
  const [ mobileOpen, setMobileOpen ] = useState(false)
  const { user, signOut } = useAuth()
  const { dark, toggleDark } = useTheme()

  return (
    <header>
      <NavLink to="/" className="logo-link" onNavigate={ () => setMobileOpen(false) }>
        <img className="logo" src={ logo } />
        <h1>MINNECRAPOLIS LIVE!</h1>
      </NavLink>

      <nav className={ `${mobileOpen ? 'mobile-open' : ''}` }>

        { !user && <NavLink to="/sign-in" onNavigate={ () => setMobileOpen(false) }>Sign In</NavLink> }

        { user &&
          <>
            <NavLink to="/how-to-stream" onNavigate={ () => setMobileOpen(false) }>How to Stream</NavLink>
            <a onClick={ signOut }>Sign Out</a>
          </>
        }

        <a onClick={ toggleDark }>{ !dark ? 'Dark' : 'Light' }</a>

      </nav>

      <a className={ `mobile-toggle ${mobileOpen ? 'active' : ''}`} onClick={ () => setMobileOpen(!mobileOpen) }>
        <div className="top-bun" />
        <div className="patty" />
        <div className="bottom-bun" />
      </a>

    </header>
  )
}

export default Header