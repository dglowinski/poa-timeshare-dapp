import { POA_SET_META_DATA } from 'constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case POA_SET_META_DATA:
      return {
        ...state,
        metaData: JSON.parse(action.metaData)
      }
    default:
      return state
  }
}
