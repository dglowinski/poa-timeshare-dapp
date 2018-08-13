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
    label: "Enter amount",
    value: ""
  }

  handleChange = event => {
    const isError = isNaN(event.target.value)
    this.setState({
      value: isError ? 0 : event.target.value,
      error: isError,
      label: isError ? "Invalid amount" : "Enter amount"
    })
  }

  render() {
    const { classes, loading, handleBuy, available, getAvailable } = this.props
    const { value, label, error } = this.state

    return (
      <div>
        <Typography className={classes.title} color="textSecondary">
          Buy tokens
        </Typography>
        <TextField
          error={error}
          id="amount"
          label={label}
          className={classes.textField}
          value={value}
          onChange={this.handleChange}
          margin="normal"
        />
        { loading 
          ? <CircularProgress className={classes.progress} style={{ color: purple[500] }} thickness={7} />
          : <Button color="primary" className={classes.button} onClick={()=>handleBuy(value)}>
              Buy
            </Button>
        }
        <div>
          <Typography className={classes.title} color="textSecondary">
            Amount available for sale: {available}
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
  handleBuy: PropTypes.func.isRequired, 
  available: PropTypes.string,
  getAvailable: PropTypes.func.isRequired,
}


export default withStyles(styles)(PoaBuyToken)