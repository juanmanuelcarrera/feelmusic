import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
// import api from '../middleware/api'

import * as reducers from '../reducers';

const reducer = combineReducers(reducers);

const configureStore = preloadedState => createStore(
  reducer,
  preloadedState,
  applyMiddleware(thunk)
)
//applyMiddleware(thunk, api)
export default configureStore