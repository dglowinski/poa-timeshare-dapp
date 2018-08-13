import { POA_SET_META_DATA } from 'constants/actionTypes'
import store from 'store'
import PoaTokenContract from '../../build/contracts/PoAToken.json'
import contract from 'truffle-contract'

const _setMetaData = metaData => ({ type: POA_SET_META_DATA, metaData })
//const _showError = error => ({ type: SHOW_ERROR, error })

const getMetaData = () => {
  return function(dispatch, getState) {
    let web3 = getState().web3.web3Instance

    if (web3) {
      const poaToken = contract(PoaTokenContract)
      poaToken.setProvider(web3.currentProvider)

      poaToken
        .deployed()
        .then(instance => instance.getMetaData())
        .then(metaData => dispatch(_setMetaData(metaData)))
        .catch(error => {
          // If error...
        })
    } else {
      console.error('Web3 is not initialized.')
    }
  }
}

export default {
  getMetaData
}
