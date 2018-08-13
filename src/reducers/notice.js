import { NOTICE_MESSAGE, NOTICE_MESSAGE_CLEAR } from 'constants/actionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case NOTICE_MESSAGE:
      return {
        ...state,
        noticeMessage: action.message
      }
    case NOTICE_MESSAGE_CLEAR:
      return {
        ...state,
        noticeMessage: ''
      }
    default:
      return state
  }
}
