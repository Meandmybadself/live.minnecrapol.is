import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import HomeScreen from 'screens/home-screen'
import HowToStreamScreen from 'screens/how-to-stream-screen'

import Header from 'components/header'

const HowToStreamContainer = withRouter(({ location }) => {
  return (
    <div>
      <TransitionGroup className="transition-group">
        <CSSTransition
          key={location.key}
          timeout={{ enter: 500, exit: 500 }}
          classNames="slide-down"
        >
          <Switch location={ location }>
            <Route path="/how-to-stream">
              <HowToStreamScreen />
            </Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  )
})

const AuthenticatedRouter = () => {
  return (
    <Router>
      <Header />

      <div className="page-container">

        <Switch>
          <Route path={[ "/", "/how-to-stream" ]} exact>
            <HomeScreen />

            <HowToStreamContainer />
          </Route>

          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>

      </div>
    </Router>
  )
}

export default AuthenticatedRouter