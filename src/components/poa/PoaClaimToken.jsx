import React from 'react'
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import Section from 'components/common/Section'
import styles from 'styles/operations'

class PoaBuyToken extends React.Component {
  state = {
    label: 'Enter amount',
    value: ''
  }

  handleChange = event => {
    const isError = isNaN(event.target.value)
    this.setState({
      value: isError ? 0 : event.target.value,
      error: isError,
      label: isError ? 'Invalid amount' : 'Enter amount',
      tokenValue: isError ? '-' : Number(event.target.value) * 1000
    })
  }

  render() {
    const {
      classes,
      loading,
      handleClaim,
      available,
      getAvailable
    } = this.props
    const { value, label, error } = this.state

    return (
      <div>
        <Section heading="Claim TST tokens" icon="exit_to_app" />
        <TextField
          error={error}
          id="amount"
          label={label}
          className={classes.textField}
          value={value}
          onChange={this.handleChange}
          margin="normal"
        />
        {loading ? (
          <CircularProgress
            className={classes.progress}
            style={{ color: purple[500] }}
            thickness={7}
          />
        ) : (
          <Button
            color="primary"
            className={classes.button}
            onClick={() => handleClaim(value)}
          >
            Claim
          </Button>
        )}
        <div>
          <Typography className={classes.title} color="textSecondary">
            Amount available (more each block): <b>{available}</b>
          </Typography>
          <Button
            color="primary"
            className={classes.button}
            onClick={getAvailable}
          >
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
  handleClaim: PropTypes.func.isRequired,
  available: PropTypes.string,
  getAvailable: PropTypes.func.isRequired
}

export default withStyles(styles)(PoaBuyToken)
