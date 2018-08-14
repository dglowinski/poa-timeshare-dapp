import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import getWeb3 from './util/web3/getWeb3'

import 'index.css'

import App from './App'

import store from './store'

getWeb3
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <Router>
          <Switch>
            <App />
          </Switch>
        </Router>
      </Provider>,
      document.getElementById('root')
    )
  })
  .catch(() => {
    ReactDOM.render(
      <div>Failed to launch app</div>,
      document.getElementById('root')
    )
  })
