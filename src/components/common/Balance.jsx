import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import poaActions from 'actions/poa'
import Section from 'components/common/Section'
import styles from 'styles/operations'

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
        <Section heading="Check address balance" icon="account_balance_wallet" /> 
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
          Balance: <b>{balance || "-"}</b>
        </Typography>
      </div>
    )
  }
}

Balance.propTypes = {
  classes: PropTypes.object.isRequired,
  getAddressBalance: PropTypes.func.isRequired,
  balance: PropTypes.string,
}

export default withStyles(styles)(Balance)