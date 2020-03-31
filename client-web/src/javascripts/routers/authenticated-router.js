import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import HomeScreen from 'screens/home-screen'

const AuthenticatedRouter = () => {
  return (
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
  )
}

export default AuthenticatedRouter