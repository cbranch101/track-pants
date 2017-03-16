import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import {
    forwardToRenderer,
    triggerAlias,
    replayActionMain,
    forwardToMain,
    replayActionRenderer,
    getInitialStateRenderer,
} from 'electron-redux';
import { hashHistory } from 'react-router';
import { routerMiddleware, push } from 'react-router-redux';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

const actionCreators = {
    push,
};

const logger = createLogger({
    level: 'info',
    collapsed: true
});

const router = routerMiddleware(hashHistory);

// If Redux DevTools Extension is installed use it, otherwise use Redux compose


export default function configureStore() {
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
    }) :
    compose;
  /* eslint-enable no-underscore-dangle */

    const enhancer = composeEnhancers(
        applyMiddleware(forwardToMain, router, thunk, logger)
    )
    const initialState = getInitialStateRenderer();
    const store = createStore(rootReducer, initialState, enhancer);

    if (module.hot) {
        module.hot.accept('../reducers', () =>
        store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    )
    }

    replayActionRenderer(store)
    return store
}

export function configureElectronStore(initialState: Object) {
    const enhancer = compose(
        applyMiddleware(triggerAlias, thunk, forwardToRenderer)
    )
    const store = createStore(rootReducer, initialState, enhancer);
    replayActionMain(store)
    return store;
}
