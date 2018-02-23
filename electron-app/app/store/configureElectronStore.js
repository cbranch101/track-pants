import { forwardToRenderer, triggerAlias, replayActionMain } from 'electron-redux'
import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers'

export default initialState => {
    const enhancer = compose(applyMiddleware(triggerAlias, thunk, forwardToRenderer))
    const store = createStore(rootReducer, initialState, enhancer)
    replayActionMain(store)
    return store
}
