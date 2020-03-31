import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [ user, setUser ] = useState(null)
  const [ token, setToken ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const signIn = async (code) => {
    try {
      setLoading(true)

      const signInResponse = await axios.request({
        url: `${API_HOST}/api/auth/slack`,
        method: 'post',
        data: { code }
      })

      const { user, token } = signInResponse.data

      window.localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
    } catch (error) {
      console.error('Error signing in with Slack', error)

      signOut()
    } finally {
      setLoading(false)
    }
  }

  const refresh = async (currentToken) => {
    try {
      setLoading(true)

      const refreshResponse = await axios.request({
        url: `${API_HOST}/api/auth/refresh`,
        method: 'post',
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      })

      const { user, token } = refreshResponse.data

      window.localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
    } catch (error) {
      console.error('Error refreshing user with token', error)

      signOut()
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    window.localStorage.clear()
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const token = window.localStorage.getItem('token')
    
    if (token) {
      refresh(token)
    }
  }, [])

  const value = {
    user,
    token,
    loading,

    signIn,
    signOut
  }

  return (
    <AuthContext.Provider value={ value }>
      { children }
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export default AuthProvider
export { useAuth }