import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import purple from '@material-ui/core/colors/purple';
import Section from 'components/common/Section'
import styles from 'styles/operations'

class PoaBuyToken extends React.Component {
  state = {
    label: "Enter Ξ amount",
    value: "",
    tokenValue: 0,
    dialogOpen: false,
    dialogShown: false,
  }

  handleClickOpen = () => {
    this.setState({ dialogOpen: true });
  };

  handleClose = () => {
    this.setState({ dialogOpen: false, dialogShown:true });
  };

  handleChange = event => {
    const isError = isNaN(event.target.value)
    this.setState({
      value: isError ? 0 : event.target.value,
      error: isError,
      label: isError ? "Invalid amount" : "Enter Ξ amount",
      tokenValue: isError ? "-" : Number(event.target.value) * 1000
    })
  }

  render() {
    const { classes, loading, handleBuy, available, getAvailable } = this.props
    const { value, label, error, tokenValue } = this.state

    return (
      <div>
        <Section heading="Buy tokens" icon="shopping_cart" />
        <TextField
          error={error}
          id="amount"
          label={label}
          className={classes.textField}
          value={value}
          onChange={this.handleChange}
          onFocus={this.handleClickOpen}
          margin="normal"
        /> 
        <Typography className={classes.title} color="textSecondary">
          receive: <b>{tokenValue}</b> tokens
        </Typography>
        { loading 
          ? <CircularProgress className={classes.progress} style={{ color: purple[500] }} thickness={7} />
          : <Button color="primary" className={classes.button} onClick={()=>handleBuy(value)}>
              Buy
            </Button>
        }
        <div>
          <Typography className={classes.title} color="textSecondary">
            Amount available for sale: <b>{available}</b>
          </Typography>
          <Button color="primary" className={classes.button} onClick={getAvailable}>
              Check
          </Button>
        </div>
        <Dialog
          open={this.state.dialogOpen && !this.state.dialogShown}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Before you buy"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              A notice on the price of the token. It's pretty cheap, 1 Ether will buy the whole supply. 
              This is because every "day", which is 2 blocks, total supply of tokens generates 1 Time Share Token.
              So if you are on Ropsten in order to see this in action and not have to wait too long (or spend too much precious fake ether), 
              you need to own a large part of the total supply.
              If you buy 50% for 0.5 Ether, you will be able to claim 1 TST in 4 blocks. Just please have in mind, that this
              way the supply will quickly run out, and the next person will not be able to play, unless you transfer
              them some of your tokens.
              <br/>&nbsp;<br/>
              If you run locally, its best to buy all tokens 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Affirmative
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

PoaBuyToken.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool, 
  handleBuy: PropTypes.func.isRequired, 
  available: PropTypes.string,
  getAvailable: PropTypes.func.isRequired,
}


export default withStyles(styles)(PoaBuyToken)