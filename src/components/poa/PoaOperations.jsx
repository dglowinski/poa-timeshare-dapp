import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Balance from 'components/common/Balance'
import PoaBuyToken from 'components/poa/PoaBuyToken'
import PoaClaimToken from 'components/poa/PoaClaimToken'
import Transfer from 'components/common/Transfer'
import Details from 'components/common/Details'
import poaActions from 'actions/poa'

const mapStateToProps = state => {
  return {
    balance: state.poa.addressBalance,
    metaMaskBalance: state.poa.metaMaskBalance,
    tokenDetails: state.poa.tokenDetails,
    buyLoading: state.poa.buyLoading,
    available: state.poa.available,
    claimable: state.poa.claimable,
    claimLoading: state.poa.claimLoading,
    transferLoading: state.poa.transferLoading,
    isAddress:
      state.web3.web3Instance && state.web3.web3Instance.utils.isAddress
  }
}

const mapDispatchToProps = dispatch => {
  const {
    getAddressBalance,
    getMetaMaskBalance,
    getTokenDetails,
    buyToken,
    getAvailable,
    claimTst,
    getClaimable,
    transfer
  } = bindActionCreators(poaActions, dispatch)

  return {
    getAddressBalance,
    getMetaMaskBalance,
    getTokenDetails,
    buyToken,
    getAvailable,
    claimTst,
    getClaimable,
    transfer
  }
}

const styles = {
  card: {
    minWidth: 275,
    height: '100%'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    marginTop: 30
  }
}

class PoaOperations extends React.Component {
  componentDidMount() {
    const { getMetaMaskBalance, getAvailable, getClaimable } = this.props
    getMetaMaskBalance()
    getAvailable()
    getClaimable()
  }

  render() {
    const {
      classes,
      buyToken,
      buyLoading,
      metaMaskBalance,
      tokenDetails,
      getAvailable,
      available,
      getMetaMaskBalance,
      claimTst,
      getClaimable,
      claimable,
      claimLoading,
      transfer,
      transferLoading,
      isAddress,
      balance,
      getAddressBalance
    } = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              PoA token
            </Typography>
            <Details details={tokenDetails} classes={classes} />
            <Divider />
            <Balance
              balance={balance}
              getAddressBalance={getAddressBalance}
              isAddress={isAddress}
            />
            <Divider />
            <PoaBuyToken
              handleBuy={buyToken}
              loading={buyLoading}
              getAvailable={getAvailable}
              available={available}
            />
            <Divider />
            <Transfer
              handleTransfer={transfer}
              loading={transferLoading}
              getAvailable={getMetaMaskBalance}
              available={metaMaskBalance}
              isAddress={isAddress}
            />
            <Divider />
            <PoaClaimToken
              handleClaim={claimTst}
              loading={claimLoading}
              getAvailable={getClaimable}
              available={claimable}
            />
          </CardContent>
        </Card>
      </div>
    )
  }
}

PoaOperations.propTypes = {
  classes: PropTypes.object.isRequired,
  buyToken: PropTypes.func.isRequired,
  buyTokenLoading: PropTypes.bool,
  metaMaskBalance: PropTypes.string,
  getMetaMaskBalance: PropTypes.func.isRequired,
  getTokenDetails: PropTypes.func.isRequired,
  tokenDetails: PropTypes.object,
  claimTst: PropTypes.func.isRequired,
  claimLoading: PropTypes.bool,
  getClaimable: PropTypes.func.isRequired,
  claimable: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(PoaOperations))
