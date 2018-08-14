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
import Transfer from 'components/common/Transfer'
import Details from 'components/common/Details'
import TstBook from 'components/tst/TstBook'
import TstVerify from 'components/tst/TstVerify'
import tstActions from 'actions/tst'

const mapStateToProps = state => {
  return {
    balance: state.tst.addressBalance,
    metaMaskBalance: state.tst.metaMaskBalance,
    tokenDetails: state.tst.tokenDetails,
    transferLoading: state.tst.transferLoading,
    booked: state.tst.booked,
    bookLoading: state.tst.bookLoading,
    verified: state.tst.verified,
    accessKey: state.tst.accessKey,
    isAddress:
      state.web3.web3Instance && state.web3.web3Instance.utils.isAddress
  }
}

const mapDispatchToProps = dispatch => {
  const {
    getAddressBalance,
    getMetaMaskBalance,
    getTokenDetails,
    transfer,
    bookDay,
    checkMonth,
    verifyKey
  } = bindActionCreators(tstActions, dispatch)

  return {
    getAddressBalance,
    getMetaMaskBalance,
    getTokenDetails,
    transfer,
    bookDay,
    checkMonth,
    verifyKey
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

class TstOperations extends React.Component {
  componentDidMount() {
    const { getMetaMaskBalance } = this.props
    getMetaMaskBalance()
  }

  render() {
    const {
      classes,
      metaMaskBalance,
      tokenDetails,
      getMetaMaskBalance,
      transfer,
      transferLoading,
      isAddress,
      balance,
      getAddressBalance,
      checkBooking,
      booked,
      checkMonth,
      bookDay,
      bookLoading,
      accessKey,
      verified,
      verifyKey
    } = this.props

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              Time Share Token
            </Typography>
            <Details details={tokenDetails} classes={classes} />
            <Divider />
            <Balance
              balance={balance}
              getAddressBalance={getAddressBalance}
              isAddress={isAddress}
            />
            <Divider />
            <Transfer
              handleTransfer={transfer}
              loading={transferLoading}
              getAvailable={getMetaMaskBalance}
              available={metaMaskBalance}
              isAddress={isAddress}
            />

            <TstBook
              checkBooking={checkBooking}
              booked={booked}
              checkMonth={checkMonth}
              bookDay={bookDay}
              loading={bookLoading}
              accessKey={accessKey}
            />
            <Divider />
            <TstVerify verified={verified} verifyKey={verifyKey} />
          </CardContent>
        </Card>
      </div>
    )
  }
}

TstOperations.propTypes = {
  classes: PropTypes.object.isRequired,
  metaMaskBalance: PropTypes.string,
  getMetaMaskBalance: PropTypes.func.isRequired,
  getTokenDetails: PropTypes.func.isRequired,
  tokenDetails: PropTypes.object,
  booked: PropTypes.array,
  checkMonth: PropTypes.func.isRequired,
  bookDay: PropTypes.func.isRequired,
  bookLoading: PropTypes.bool,
  accessKey: PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(TstOperations))
