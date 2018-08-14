import {
  TST_SET_TOKEN_DETAILS,
  TST_SET_ADDRESS_BALANCE,
  TST_SET_METAMASK_BALANCE,
  TST_SET_TRANSFER_LOADING,
  TST_UNSET_TRANSFER_LOADING,
  TST_SET_BOOKED_DAYS,
  TST_SET_BOOK_LOADING,
  TST_UNSET_BOOK_LOADING,
  TST_SET_KEY,
  TST_SET_VALID
} from 'constants/actionTypes'

const initialState = {
  tokenDetails: {},
  metaMaskBalance: '-'
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TST_SET_TOKEN_DETAILS:
      return {
        ...state,
        tokenDetails: action.tokenDetails
      }
    case TST_SET_ADDRESS_BALANCE:
      return {
        ...state,
        addressBalance: action.balance
      }
    case TST_SET_METAMASK_BALANCE:
      return {
        ...state,
        metaMaskBalance: action.balance
      }
    case TST_SET_TRANSFER_LOADING:
      return {
        ...state,
        transferLoading: true
      }
    case TST_UNSET_TRANSFER_LOADING:
      return {
        ...state,
        transferLoading: false
      }
    case TST_SET_BOOKED_DAYS:
      return {
        ...state,
        booked: action.days
          .map((isBooked, index) => ({
            date: new Date(action.year, Number(action.month) - 1, index + 1),
            isBooked
          }))
          .filter(day => day.isBooked)
          .map(day => day.date)
      }
    case TST_SET_BOOK_LOADING:
      return {
        ...state,
        bookLoading: true
      }
    case TST_UNSET_BOOK_LOADING:
      return {
        ...state,
        bookLoading: false
      }
    case TST_SET_KEY:
      return {
        ...state,
        accessKey: btoa(action.key)
      }
    case TST_SET_VALID:
      return {
        ...state,
        verified: action.valid
      }
    default:
      return state
  }
}
