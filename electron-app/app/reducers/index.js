// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import client from '../apollo-client';

const rootReducer = combineReducers({
    apollo: client.reducer(),
    routing,
    form,
});

export default rootReducer;
