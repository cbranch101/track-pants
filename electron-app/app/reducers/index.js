// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import client from '../apollo-client';
import counter from './counter';

const rootReducer = combineReducers({
  apollo: client.reducer(),
  counter,
  routing,
  form,
});

export default rootReducer;
