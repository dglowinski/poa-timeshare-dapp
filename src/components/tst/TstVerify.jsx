import React from 'react'
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import DayPicker from 'react-day-picker';
import TextField from '@material-ui/core/TextField';
import 'react-day-picker/lib/style.css';
import Section from 'components/common/Section'
import Icon from '@material-ui/core/Icon';
import styles from 'styles/operations'



class TstVerify extends React.Component {

  state = {
    key:""
  }

  handleDayClick = day => this.setState({day})

  handleChange = event => {
    const { day } = this.state
    this.setState({key: event.target.value})
    this.props.verifyKey(day, event.target.value)
  }

  render() {
    const {
      classes,
      verified,
    } = this.props

    const { key, day } = this.state

    return (
      <div>
        <Section heading="Open the door. Pick the day first" icon="date_range" /> 
        <div>
          <div style={{float:'left'}} >
            <DayPicker
              onDayClick={this.handleDayClick}
              selectedDays={[day]}
            />
          </div>

            <div style={{display:"inline-block", margin:20, maxWidth:400}}>
              <TextField
                id="key"
                disabled={!day}
                label="Enter your key"
                className={classes.textField}
                value={key}
                multiline
                rowsMax="4"
                rows="4"
                onChange={this.handleChange}
                margin="normal"
                style={{width:300}}
              />
            </div>
        </div>
        <div style={{float:'left'}}>

        </div>
        <div style={{display:'inline-block'}} >
            { verified 
              ? <Icon style={{color:'green', fontSize:95}}>{"lock_open"}</Icon>
              : <Icon style={{color:'red', fontSize:95}}>{"lock"}</Icon>
            }
        </div>
        <Typography className={classes.title} color="textSecondary">
          Currently this feature only works with local ganache-cli, due to <a href="https://github.com/trufflesuite/ganache-cli/issues/243" target="blank">complications with signing</a>
        </Typography>
      </div>
    )
  }
}

TstVerify.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool, 
}

export default withStyles(styles)(TstVerify)