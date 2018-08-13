import contract from 'truffle-contract'
import PoaTokenContract from '../../build/contracts/PoAToken.json'

import {
  POA_SET_TOKEN_DETAILS,
  POA_SET_ADDRESS_BALANCE,
  POA_SET_METAMASK_BALANCE,
  POA_SET_BUY_LOADING,
  POA_UNSET_BUY_LOADING,
  POA_SET_AVAILABLE
} from 'constants/actionTypes'

const setTokenDetails = tokenDetails => ({
  type: POA_SET_TOKEN_DETAILS,
  tokenDetails
})
const setAddressBalance = balance => ({
  type: POA_SET_ADDRESS_BALANCE,
  balance
})
const setMetaMaskBalance = balance => ({
  type: POA_SET_METAMASK_BALANCE,
  balance
})
const setBuyLoading = () => ({ type: POA_SET_BUY_LOADING })
const unsetBuyLoading = () => ({ type: POA_UNSET_BUY_LOADING })
const setAvailable = amount => ({ type: POA_SET_AVAILABLE, amount })
//const _showError = error => ({ type: SHOW_ERROR, error })

const poaDeployed = web3 => {
  if (!web3) throw new Error('Web3 is not initialized.')

  const poaToken = contract(PoaTokenContract)
  poaToken.setProvider(web3.currentProvider)

  return poaToken.deployed()
}

const getTokenDetails = () => (dispatch, getState) => {
  poaDeployed(getState().web3.web3Instance)
    .then(instance =>
      Promise.all([
        instance.getMetaData(),
        instance.symbol(),
        instance.name(),
        instance.decimals(),
        instance.address
      ])
    )
    .then(([metaData, symbol, name, decimals, address]) =>
      dispatch(
        setTokenDetails({
          metaData: JSON.parse(metaData),
          symbol,
          name,
          decimals: decimals.toString(),
          address
        })
      )
    )
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

const buyToken = amount => (dispatch, getState) => {
  console.log('amount: ', amount)
  const web3 = getState().web3.web3Instance
  let address

  dispatch(setBuyLoading())
  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return poaDeployed(web3)
    })
    .then(instance =>
      instance.sendTransaction({
        value: web3.utils.toWei(String(amount), 'ether'),
        from: address,
        gasPrice: web3.utils.toWei('20', 'gwei')
      })
    )
    .then(tx => {
      getMetaMaskBalance()(dispatch, getState)
      getAvailable()(dispatch, getState)
      if (tx.receipt.status != '0x1') throw new Error('Transaction failed')
    })
    .catch(console.error)
    .finally(() => {
      dispatch(unsetBuyLoading())
    })
}

const getAvailable = () => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance
  poaDeployed(web3)
    .then(instance => instance.getTokensForSaleAvailable())
    .then(amount => {
      console.log('amount: ', amount)
      dispatch(setAvailable(web3.utils.fromWei(amount.toPrecision(), 'ether')))
    })
    .catch(console.error)
}

export default {
  getTokenDetails,
  getAddressBalance,
  getMetaMaskBalance,
  buyToken,
  getAvailable
}
