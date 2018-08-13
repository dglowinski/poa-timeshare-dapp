import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import poaActions from 'actions/poa'

const mapStateToProps = (state, ownProps) => {
  return {
   // balance: ownProps === "PoA" ? state.poa.addressBalance : state.tst.addressBalance,
    balance: state.poa.addressBalance,
    isAddress: state.web3.web3Instance && state.web3.web3Instance.utils.isAddress || null,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  // const { getAddressBalance } = ownProps === "PoA" 
  //   ? bindActionCreators(poaActions, dispatch)
  //   : bindActionCreators(tstActions, dispatch)
  const { getAddressBalance } = bindActionCreators(poaActions, dispatch)
  return {
    getAddressBalance
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


class Balance extends React.Component {
  state = {
    label: "Enter ethereum address",
    value: ""
  }

  handleChange = event => {
    const { isAddress, getAddressBalance } = this.props
    const isError = isAddress && !isAddress(event.target.value)

    this.setState({
      value: event.target.value,
      error: isError,
      label: isError ? "Invalid address" : "Enter ethereum address"
    })

    !isError && getAddressBalance(event.target.value)
  }

  render() {
    const { balance, classes } = this.props
    const { value, label, error } = this.state

    return (
      <div>
        <Typography className={classes.title} color="textSecondary">
          Get balance of address
        </Typography>
        <TextField
          error={error}
          id="address"
          label={label}
          className={classes.textField}
          value={value}
          onChange={this.handleChange}
          margin="normal"
        />
        <Typography className={classes.title} color="textSecondary">
          Balance: {balance || "-"}
        </Typography>
      </div>
    )
  }
}

Balance.propTypes = {
  classes: PropTypes.object.isRequired,
  getAddressBalance: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  balance: PropTypes.number,
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Balance))