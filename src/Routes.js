import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import DashboardPage from 'pages/DashboardPage'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={DashboardPage}/>
      </Switch>
    </Router>
  )
}