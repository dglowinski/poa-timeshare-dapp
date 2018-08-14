import contract from 'truffle-contract'
import PoaTokenContract from '../../build/contracts/PoAToken.json'

import {
  NOTICE_MESSAGE,
  POA_SET_TOKEN_DETAILS,
  POA_SET_ADDRESS_BALANCE,
  POA_SET_METAMASK_BALANCE,
  POA_SET_BUY_LOADING,
  POA_UNSET_BUY_LOADING,
  POA_SET_AVAILABLE,
  POA_SET_CLAIM_LOADING,
  POA_UNSET_CLAIM_LOADING,
  POA_SET_CLAIMABLE,
  POA_SET_TRANSFER_LOADING,
  POA_UNSET_TRANSFER_LOADING
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
const setClaimLoading = () => ({ type: POA_SET_CLAIM_LOADING })
const unsetClaimLoading = () => ({ type: POA_UNSET_CLAIM_LOADING })
const setTransferLoading = () => ({ type: POA_SET_TRANSFER_LOADING })
const unsetTransferLoading = () => ({ type: POA_UNSET_TRANSFER_LOADING })
const setAvailable = amount => ({ type: POA_SET_AVAILABLE, amount })
const setClaimable = amount => ({ type: POA_SET_CLAIMABLE, amount })
const showError = error => {
  // debugger
  const message =
    'ERROR: ' + error.message ||
    (typeof error === 'string' ? error : 'An error has occured')
  return { type: NOTICE_MESSAGE, message }
}
const showNotice = message => ({ type: NOTICE_MESSAGE, message })

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
    .catch(error => dispatch(showError(error)))
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
    .catch(error => dispatch(showError(error)))
}

const getMetaMaskBalance = () => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance

  let address

  web3.eth.getCoinbase().then(coinbase => {
    address = coinbase
    return poaDeployed(web3)
  })
  poaDeployed(web3)
    .then(instance => instance.balanceOf(address))
    .then(balance => {
      dispatch(
        setMetaMaskBalance(web3.utils.fromWei(balance.toString(), 'ether'))
      )
    })
    .catch(error => dispatch(showError(error)))
}

const buyToken = amount => (dispatch, getState) => {
  if (!amount) return

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
      if (tx.receipt.status === '0x0') throw new Error('Transaction failed')
      dispatch(showNotice(`You have successfully bought ${amount} tokens`))
      getMetaMaskBalance()(dispatch, getState)
      getAvailable()(dispatch, getState)
    })
    .catch(error => dispatch(showError(error)))
    .finally(() => {
      dispatch(unsetBuyLoading())
    })
}

const getAvailable = () => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance
  poaDeployed(web3)
    .then(instance => instance.getTokensForSaleAvailable())
    .then(amount => {
      dispatch(setAvailable(web3.utils.fromWei(amount.toPrecision(), 'ether')))
    })
    .catch(error => dispatch(showError(error)))
}

const claimTst = amount => (dispatch, getState) => {
  if (!amount) return

  const web3 = getState().web3.web3Instance

  dispatch(setClaimLoading())

  let address

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return poaDeployed(web3)
    })
    .then(instance =>
      instance.claimTimeShareTokens(web3.utils.toWei(String(amount), 'ether'), {
        from: address,
        gasPrice: web3.utils.toWei('20', 'gwei')
      })
    )
    .then(tx => {
      if (tx.receipt.status === '0x0') throw new Error('Transaction failed')
      dispatch(showNotice(`You have successfully claimed ${amount} tokens`))
      getClaimable()(dispatch, getState)
    })
    .catch(error => dispatch(showError(error)))
    .finally(() => {
      dispatch(unsetClaimLoading())
    })
}

const getClaimable = () => (dispatch, getState) => {
  const web3 = getState().web3.web3Instance
  let address

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return poaDeployed(web3)
    })
    .then(instance => instance.timeShareBalanceOf(address))
    .then(amount => {
      dispatch(setClaimable(web3.utils.fromWei(amount.toPrecision(), 'ether')))
    })
    .catch(error => dispatch(showError(error)))
}

const transfer = (toAddress, amount) => (dispatch, getState) => {
  if (!amount) return

  const web3 = getState().web3.web3Instance

  dispatch(setTransferLoading())

  let fromAddress

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      fromAddress = coinbase
      return poaDeployed(web3)
    })
    .then(instance =>
      instance.transfer(toAddress, web3.utils.toWei(String(amount), 'ether'), {
        from: fromAddress,
        gasPrice: web3.utils.toWei('20', 'gwei')
      })
    )
    .then(tx => {
      if (tx.receipt.status === '0x0') throw new Error('Transaction failed')
      dispatch(
        showNotice(
          `You have successfully transfered ${amount} tokens to ${toAddress}`
        )
      )
      getMetaMaskBalance()(dispatch, getState)
    })
    .catch(error => dispatch(showError(error)))
    .finally(() => {
      dispatch(unsetTransferLoading())
    })
}

export default {
  getTokenDetails,
  getAddressBalance,
  getMetaMaskBalance,
  buyToken,
  getAvailable,
  claimTst,
  getClaimable,
  transfer
}
