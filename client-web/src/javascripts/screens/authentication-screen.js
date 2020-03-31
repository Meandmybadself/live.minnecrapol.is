import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import queryString from 'query-string'

import { useAuth } from 'context/auth'

import LoadingIndicator from 'components/loading-indicator'
import SignInWithSlack from 'components/sign-in-with-slack'

const AuthenticationScreen = () => {
  const { loading, signIn } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/auth/slack') {
      const { code } = queryString.parse(location.search)
      signIn(code)
    }
  }, [ location ])

  if (loading) {
    return (
      <div className="page sign-in-page">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className="page sign-in-page">
      <div className="sign-in-content">
        <h2>Sign in with your Minnecrapolis Slack account. Cut the cord and start streamin'.</h2>
        <SignInWithSlack />
        <p>Not a member of Minnecrapolis? Sign up at <a href="https://minnecrapol.is">minnecrapol.is</a>.</p>
      </div>
    </div>
  )
}

export default AuthenticationScreen