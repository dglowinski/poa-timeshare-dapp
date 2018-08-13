import { combineReducers } from 'redux'
import web3Reducer from './util/web3/web3Reducer'
import poaReducer from 'reducers/poa'
import noticeReducer from 'reducers/notice'

const reducer = combineReducers({
  notice: noticeReducer,
  poa: poaReducer,
  web3: web3Reducer
})

export default reducer
