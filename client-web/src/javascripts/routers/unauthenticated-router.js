import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import AuthenticationScreen from 'screens/authentication-screen'

const UnauthenticatedRouter = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <AuthenticationScreen />
        </Route>

        <Route path="/auth/slack" exact>
          <AuthenticationScreen />
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  )
}

export default UnauthenticatedRouter