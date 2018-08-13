import {
  POA_SET_TOKEN_DETAILS,
  POA_SET_ADDRESS_BALANCE,
  POA_SET_METAMASK_BALANCE,
  POA_SET_BUY_LOADING,
  POA_UNSET_BUY_LOADING,
  POA_SET_AVAILABLE
} from 'constants/actionTypes'

const initialState = {
  tokenDetails: {},
  metaMaskBalance: '-'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case POA_SET_TOKEN_DETAILS:
      return {
        ...state,
        tokenDetails: action.tokenDetails
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
    case POA_SET_BUY_LOADING:
      return {
        ...state,
        buyLoading: true
      }
    case POA_UNSET_BUY_LOADING:
      return {
        ...state,
        buyLoading: false
      }
    case POA_SET_AVAILABLE:
      return {
        ...state,
        available: action.amount
      }
    default:
      return state
  }
}
