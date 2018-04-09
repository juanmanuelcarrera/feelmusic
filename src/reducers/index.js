import { combineReducers } from 'redux'

import compass_reducer from './compass_reducer';
import sound_reducer from './sound_reducer';

export default combineReducers({
  compass: compass_reducer,
  sound: sound_reducer
})