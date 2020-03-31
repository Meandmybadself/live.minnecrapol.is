import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import AuthenticationScreen from 'screens/authentication-screen'
import HomeScreen from 'screens/home-screen'

import Header from 'components/header'

const UnauthenticatedRouter = () => {
  return (
    <Router>
      <Header />

      <div className="page-container">

        <Switch>
          <Route path="/" exact>
            <HomeScreen />
          </Route>

          <Route path="/sign-in" exact>
            <AuthenticationScreen />
          </Route>

          <Route path="/auth/slack" exact>
            <AuthenticationScreen />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default UnauthenticatedRouter