// @flow
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import routes from './routes'
import client from './apollo-client'
import configureStore from './store/configureStore'
import './app.global.css'

const store = configureStore();
const history = syncHistoryWithStore(hashHistory, store)
render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <MuiThemeProvider>
        <Router history={history} routes={routes} />
      </MuiThemeProvider>
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
)
