import contract from 'truffle-contract'
import moment from 'moment'
import TstTokenContract from '../../build/contracts/TimeShareToken.json'
import PoaTokenContract from '../../build/contracts/PoAToken.json'

import {
  NOTICE_MESSAGE,
  TST_SET_TOKEN_DETAILS,
  TST_SET_ADDRESS_BALANCE,
  TST_SET_METAMASK_BALANCE,
  TST_SET_TRANSFER_LOADING,
  TST_UNSET_TRANSFER_LOADING,
  TST_SET_BOOKED_DAYS,
  TST_SET_BOOK_LOADING,
  TST_UNSET_BOOK_LOADING,
  TST_SET_KEY
} from 'constants/actionTypes'

const setTokenDetails = tokenDetails => ({
  type: TST_SET_TOKEN_DETAILS,
  tokenDetails
})
const setAddressBalance = balance => ({
  type: TST_SET_ADDRESS_BALANCE,
  balance
})
const setMetaMaskBalance = balance => ({
  type: TST_SET_METAMASK_BALANCE,
  balance
})
const setTransferLoading = () => ({ type: TST_SET_TRANSFER_LOADING })
const unsetTransferLoading = () => ({ type: TST_UNSET_TRANSFER_LOADING })
const setBookLoading = () => ({ type: TST_SET_BOOK_LOADING })
const unsetBookLoading = () => ({ type: TST_UNSET_BOOK_LOADING })
const setBooked = (year, month, days) => ({
  type: TST_SET_BOOKED_DAYS,
  year,
  month,
  days
})
const setKey = key => ({ type: TST_SET_KEY, key })

const showError = error => {
  const message =
    'ERROR: ' + error.message ||
    (typeof error === 'string' ? error : 'An error has occured')
  return { type: NOTICE_MESSAGE, message }
}
const showNotice = message => ({ type: NOTICE_MESSAGE, message })

const tstDeployedMemoize = () => {
  let cachedDeployed

  return web3 => {
    if (!web3) throw new Error('Web3 is not initialized.')

    if (!cachedDeployed) {
      const tstToken = contract(TstTokenContract)
      tstToken.setProvider(web3.currentProvider)

      const poaToken = contract(PoaTokenContract)
      poaToken.setProvider(web3.currentProvider)

      cachedDeployed = poaToken
        .deployed()
        .then(instance => instance.getTimeShareTokenAddress())
        .then(address => tstToken.at(address))
    }
    return cachedDeployed
  }
}

const tstDeployed = tstDeployedMemoize()

const getTokenDetails = () => (dispatch, getState) => {
  tstDeployed(getState().web3.web3Instance)
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

  tstDeployed(web3)
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

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return tstDeployed(web3)
    })
    .then(instance => instance.balanceOf(address))
    .then(balance => {
      dispatch(
        setMetaMaskBalance(web3.utils.fromWei(balance.toString(), 'ether'))
      )
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
      return tstDeployed(web3)
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

const checkMonth = day => (dispatch, getState) => {
  const year = day.format('YYYY')
  const month = day.format('MM')

  tstDeployed(getState().web3.web3Instance)
    .then(instance =>
      Promise.all(
        Array(day.daysInMonth())
          .fill(null)
          .map((_, index) => instance.isDayBooked(year, month, index + 1))
      )
    )
    .then(daysBooked => dispatch(setBooked(year, month, daysBooked)))
    .catch(error => dispatch(showError(error)))
}

const bookDay = day => (dispatch, getState) => {
  if (!day) return

  day = moment.utc(day)
  console.log('day: ', day)

  const web3 = getState().web3.web3Instance

  dispatch(setBookLoading())

  let address

  web3.eth
    .getCoinbase()
    .then(coinbase => {
      address = coinbase
      return tstDeployed(web3)
    })
    .then(instance =>
      instance.bookDay(day.format('YYYY'), day.format('MM'), day.format('DD'), {
        from: address,
        gasPrice: web3.utils.toWei('20', 'gwei')
      })
    )
    .then(tx => {
      if (tx.receipt.status === '0x0') throw new Error('Transaction failed')
      return web3.eth.sign(web3.utils.soliditySha3(String(day.unix())), address)
    })
    .then(signature => {
      const key = JSON.stringify({ timestamp: day.unix(), signature })

      dispatch(setKey(key))
      dispatch(
        showNotice(
          `You have successfully booked the property on ${day.format(
            'DD-MM-YYYY'
          )}`
        )
      )
      getMetaMaskBalance()(dispatch, getState)
      checkMonth(day)(dispatch, getState)
    })
    .catch(error => dispatch(showError(error)))
    .finally(() => {
      dispatch(unsetBookLoading())
    })
}

const verifyKey = key => (dispatch, getState) => {}

export default {
  getTokenDetails,
  getAddressBalance,
  getMetaMaskBalance,
  transfer,
  checkMonth,
  bookDay,
  verifyKey
}
