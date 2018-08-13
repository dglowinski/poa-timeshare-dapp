import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import poaActions from 'actions/poa'

const mapStateToProps = (state, ownProps) => {
  return {
   // balance: ownProps === "PoA" ? state.poa.metaMaskBalance : state.tst.metaMaskBalance,
    balance: state.poa.metaMaskBalance,
    isAddress: state.web3.web3Instance && state.web3.web3Instance.utils.isAddress || null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // const { getMetamaskBalance } = ownProps === "PoA" 
  //   ? bindActionCreators(poaActions, dispatch)
  //   : bindActionCreators(tstActions, dispatch)
  const { getMetaMaskBalance } = bindActionCreators(poaActions, dispatch)
  return {
    getMetaMaskBalance
  }
}

const styles = theme => ({
  title: {
    marginBottom: 16,
    fontSize: 14,
    display: "inline-block"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


const BalanceMetaMask = props => {
  const { balance, classes, getMetaMaskBalance} = props

  return (
    <div>
      <Typography className={classes.title} color="textSecondary">
        Get balance of address
      </Typography>
      <Button color="primary" className={classes.button} onClick={getMetaMaskBalance}>
        Go
      </Button>
      <Typography className={classes.title} color="textSecondary">
        Balance: {balance || "-"}
      </Typography>
    </div>
  ) 
}

BalanceMetaMask.propTypes = {
  classes: PropTypes.object.isRequired,
  getMetaMaskBalance: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  balance: PropTypes.number,
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(BalanceMetaMask))