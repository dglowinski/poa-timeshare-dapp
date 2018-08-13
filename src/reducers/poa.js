import {
  POA_SET_META_DATA,
  POA_SET_ADDRESS_BALANCE,
  POA_SET_METAMASK_BALANCE
} from 'constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case POA_SET_META_DATA:
      return {
        ...state,
        metaData: JSON.parse(action.metaData)
      }
    case POA_SET_ADDRESS_BALANCE:
      return {
        ...state,
        addressBalance: action.balance
      }
    case POA_SET_METAMASK_BALANCE:
      return {
        ...state,
        metaMaskBalance: action.balance
      }
    default:
      return state
  }
}
