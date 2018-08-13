import { POA_SET_META_DATA } from 'constants/actionTypes'
import store from 'store'
import PoaTokenContract from '../../build/contracts/PoAToken.json'
import contract from 'truffle-contract'

const _setMetaData = metaData => ({ type: POA_SET_META_DATA, metaData })
//const _showError = error => ({ type: SHOW_ERROR, error })

const getMetaData = () => {
  console.log('here')
  let web3 = store.getState().web3.web3Instance
  console.log('web3: ', web3)

  if (web3) {
    return function(dispatch) {
      const poaToken = contract(PoaTokenContract)
      poaToken.setProvider(web3.currentProvider)

      let poaInstance

      // Get current ethereum wallet.
      web3.eth.getCoinbase((error, coinbase) => {
        console.log('coinbase: ', coinbase)
        // Log errors, if any.
        if (error) {
          console.error(error)
        }

        poaToken.deployed().then(instance => {
          poaInstance = instance

          poaInstance
            .getMetaData()
            .then(metaData => dispatch(_setMetaData(metaData)))
            .catch(error => {
              // If error...
            })
        })
      })
    }
  } else {
    console.error('Web3 is not initialized.')
  }
}

export default {
  getMetaData
}
