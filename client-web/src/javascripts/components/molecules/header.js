import React from 'react'

import logo from 'images/crappy-logo.png'

export const Header = ({ dark, toggleTheme }) => {
  const onHowToStreamClick = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onThemeToggleClick = e => {
    e.preventDefault()
    e.stopPropagation()

    toggleTheme()
  }

  return (
    <header>
      <img className="logo" src={ logo } />
      <h1>MINNECRAPOLIS LIVE</h1>

      <a href="#" onClick={ onHowToStreamClick }>How to Stream</a>
      <a href="#" onClick={ onThemeToggleClick }>{ !dark ? 'Dark' : 'Light' }</a>
    </header>
  )
}

export default Header