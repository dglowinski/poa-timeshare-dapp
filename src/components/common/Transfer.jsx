import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

const styles = theme => ({
  title: {
    marginBottom: 16,
    fontSize: 14,
    display: "inline-block"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 0,
    width: 200,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
});


class PoaBuyToken extends React.Component {
  state = {
    labelAddress: "Enter address",
    address: "",
    labelAmount: "Enter amount",
    amount: "",
  }


  handleChangeAddress= event => {
    const { isAddress } = this.props
    const isError = isAddress && !isAddress(event.target.value)

    this.setState({
      address: event.target.value,
      errorAddress: isError,
      labelAddress: isError ? "Invalid address" : "Enter ethereum address"
    })
  }

  handleChangeAmount = event => {
    const isError = isNaN(event.target.value)
    this.setState({
      amount: isError ? 0 : event.target.value,
      errorAmount: isError,
      labelAmount: isError ? "Invalid amount" : "Enter Ξ amount",
    })
  }

  render() {
    const { classes, loading, handleTransfer, available, getAvailable } = this.props
    const { amount, address, labelAddress, labelAmount, errorAddress, errorAmount } = this.state

    return (
      <div>
        <Typography className={classes.title} color="textSecondary">
          Transfer tokens
        </Typography>
        <TextField
          error={errorAmount}
          id="amount"
          label={labelAmount}
          className={classes.textField}
          value={amount}
          onChange={this.handleChangeAmount}
          margin="normal"
        /> 
        <TextField
          error={errorAddress}
          id="address"
          label={labelAddress}
          className={classes.textField}
          value={address}
          onChange={this.handleChangeAddress}
          margin="normal"
        /> 
        { loading 
          ? <CircularProgress className={classes.progress} style={{ color: purple[500] }} thickness={7} />
          : <Button color="primary" className={classes.button} onClick={()=>handleTransfer(address, amount)}>
              Transfer
            </Button>
        }
        <div>
          <Typography className={classes.title} color="textSecondary" style={{display: 'inline-block'}}>
            Balance of MetaMask account: <b>{available || "-"}</b>
          </Typography>
          <Button color="primary" className={classes.button} onClick={getAvailable}>
            Check
          </Button>
        </div>
      </div>
    )
  }
}

PoaBuyToken.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool, 
  handleTransfer: PropTypes.func.isRequired, 
  available: PropTypes.string,
  getAvailable: PropTypes.func.isRequired,
}


export default withStyles(styles)(PoaBuyToken)