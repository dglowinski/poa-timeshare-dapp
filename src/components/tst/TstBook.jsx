import React from 'react'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types'
import moment from 'moment'
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import Section from 'components/common/Section'
import styles from 'styles/operations'

class TstBook extends React.Component {

  state = {}

  componentDidMount() {
    const { checkMonth } = this.props
    checkMonth(moment.utc())
  }

  handleDayClick = day => this.setState({day})

  handleMonthChange = month => this.props.checkMonth(moment(month))

  render() {
    const {
      classes,       
      booked,
      bookDay,
      loading,
      accessKey,
      
    } = this.props

    const { day } = this.state

    return (
      <div>
        <Section heading="Check availability and book a day" icon="date_range" /> 
        <Typography className={classes.title} color="textSecondary">
          Check dates available in the calendar and make a booking. You need at least 1 TST.    
        </Typography>
        <div>
          <div style={{float:'left'}} >
            <DayPicker
              selectedDays={booked}
              onDayClick={this.handleDayClick}
              onMonthChange={this.handleMonthChange}
            />
          </div>
          {accessKey && 
            <div style={{display:"inline-block", margin:20, maxWidth:400}}>
              <Typography className={classes.title} color="textSecondary">
                Your access key: 
              </Typography>
              <div style={{backgroundColor:"#e5e5e5", borderRadius:3, padding: 10}}>
                <code style={{whiteSpace:"pre-wrap", wordBreak:"break-word"}}>{accessKey}</code>
              </div>
            </div>
          }
        </div>
        <div style={{clear:'both'}}>
          { loading 
            ? <CircularProgress className={classes.progress} style={{ color: purple[500] }} thickness={7} />
            : <Button color="primary" className={classes.button} onClick={()=>bookDay(day)}>
                Book
              </Button>
          }
        </div>
      </div>
    )
  }
}

TstBook.propTypes = {
  classes: PropTypes.object.isRequired,
  loading: PropTypes.bool, 
}

export default withStyles(styles)(TstBook)