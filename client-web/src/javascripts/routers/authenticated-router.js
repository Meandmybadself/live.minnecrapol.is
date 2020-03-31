import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import StreamProvider from 'context/stream'

import HomeScreen from 'screens/home-screen'

const AuthenticatedRouter = () => {
  return (
    <StreamProvider>
      <Router>
        <Switch>
          <Route path="/" exact>
            <HomeScreen />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </StreamProvider>
  )
}

export default AuthenticatedRouter