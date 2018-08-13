import React, { Component } from 'react'
import { Route } from 'react-router'
import MainLaout from 'components/MainLayout'
import PoaMain from 'components/PoaMain'
import TstMain from 'components/TstMain'
import Welcome from 'components/Welcome'

class App extends Component {
  render() {
    return (
      <MainLaout>
        <Route exact={true} path="/" component={Welcome} />
        <Route path="/poa" component={PoaMain} />
        <Route path="/tst" component={TstMain} />
      </MainLaout>
    )
  }
}

export default App
