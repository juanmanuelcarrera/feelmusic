import * as actions from '../actions/actions';

export default (state = {}, action = {}) => {
  switch (action.type) {
    case actions.SET_ZONE:
      return Object.assign({}, state, {
        zone: action.zone
      })
    case actions.SET_DEGREES:
      return Object.assign({}, state, {
        degrees: action.degrees
      })
    default:
      return state
  }
}