import React, { useState, useEffect, createContext, useContext } from 'react'

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {
  const [ dark, setDark ] = useState(window.localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    window.localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [ dark ])

  const value = {
    dark,
    setDark,
    toggleDark: () => setDark(!dark)
  }

  return (
    <ThemeContext.Provider value={ value }>
      { children }
    </ThemeContext.Provider>
  )
}

const useTheme = () => useContext(ThemeContext)

export default ThemeProvider
export { useTheme }