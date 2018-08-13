import contract from 'truffle-contract'
import PoaTokenContract from '../../build/contracts/PoAToken.json'

import {
  POA_SET_META_DATA,
  POA_SET_ADDRESS_BALANCE,
  POA_SET_METAMASK_BALANCE
} from 'constants/actionTypes'

const setMetaData = metaData => ({ type: POA_SET_META_DATA, metaData })
const setAddressBalance = balance => ({
  type: POA_SET_ADDRESS_BALANCE,
  balance
})
const setMetaMaskBalance = balance => ({
  type: POA_SET_METAMASK_BALANCE,
  balance
})
//const _showError = error => ({ type: SHOW_ERROR, error })

const poaDeployed = web3 => {
  if (!web3) return Promise.reject('Web3 is not initialized.')

  const poaToken = contract(PoaTokenContract)
  poaToken.setProvider(web3.currentProvider)

  return poaToken.deployed()
}

const getMetaData = () => (dispatch, getState) => {
  poaDeployed(getState().web3.web3Instance)
    .then(instance => instance.getMetaData())
    .then(metaData => dispatch(setMetaData(metaData)))
    .catch(console.error)
}

const getAddressBalance = address => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance

  poaDeployed(web3)
    .then(instance => instance.balanceOf(address))
    .then(balance =>
      dispatch(
        setAddressBalance(web3.utils.fromWei(balance.toString(), 'ether'))
      )
    )
    .catch(console.error)
}

const getMetaMaskBalance = () => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance
  let address

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return poaDeployed(web3)
    })
    .then(instance => instance.balanceOf(address))
    .then(balance =>
      dispatch(
        setMetaMaskBalance(web3.utils.fromWei(balance.toString(), 'ether'))
      )
    )
    .catch(console.error)
}

export default {
  getMetaData,
  getAddressBalance,
  getMetaMaskBalance
}
