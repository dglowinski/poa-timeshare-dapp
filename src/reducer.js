import { combineReducers } from 'redux'
import web3Reducer from './util/web3/web3Reducer'
import poaReducer from 'reducers/poa'
import tstReducer from 'reducers/tst'
import noticeReducer from 'reducers/notice'

const reducer = combineReducers({
  notice: noticeReducer,
  poa: poaReducer,
  tst: tstReducer,
  web3: web3Reducer
})

export default reducer
