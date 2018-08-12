import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import MainLaout from 'components/MainLayout'
import PoaMain from 'components/PoaMain'
import TstMain from 'components/TstMain'

class App extends Component {
  render() {
    return (
      <Router>
        <MainLaout>
          <Route exact={true} path="/" component={PoaMain} />
          <Route path="/tst" component={TstMain} />
        </MainLaout>
      </Router>
    )
  }
}

export default App
