import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { hashHistory } from 'react-router'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
import { routerMiddleware } from 'react-router-redux'
import rootReducer from '../reducers'

const router = routerMiddleware(hashHistory)

export default function configureStore() {
    const enhancer = compose(applyMiddleware(forwardToMain, router, thunk))
    const initialState = getInitialStateRenderer()
    const store = createStore(rootReducer, initialState, enhancer)
    replayActionRenderer(store)
    return store
}
