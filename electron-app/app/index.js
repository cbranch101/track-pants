// @flow
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { render } from 'react-dom'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import routes from './routes'
import client from './apollo-client'
import configureStore from './store/configureStore'
import './app.global.css'

injectTapEventPlugin()

const store = configureStore()

// ipcRenderer.on('redux-action', (event, payload) => {
//     store.dispatch(payload);
// });

const history = syncHistoryWithStore(hashHistory, store)
render(
    <ApolloProvider client={client} store={store}>
        <MuiThemeProvider>
            <Router history={history} routes={routes} />
        </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('root')
)
