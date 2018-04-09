/*
 * action types
 */
 
export const SET_ZONE = 'SET_ZONE'
export const SET_DEGREES = 'SET_DEGREES'

 
/*
 * action creators
 */
 
export function setZone(zone) {
  return { type: 'SET_ZONE', zone }
}

export function setDegrees(degrees) {
  return { type: 'SET_DEGREES', degrees }
}
