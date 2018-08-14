import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  title: {
    position: 'absolute',
    top: '50%',
    transform: 'translate(45px, -50%)'
    
  },
  icon: {
    color: 'white',
    backgroundColor: '#BDBDBD',
    borderRadius: 50,
    padding: 5,
    fontSize: 20  
  },
  container: {
    marginTop: 10,
    position: 'relative',
  }

});


const Section = props => {
  const { icon, heading, classes } = props

  return (
    <div className={classes.container}>
      
      <Icon className={classes.icon}>{icon}</Icon>
      <Typography className={classes.title} variant="title">
        {heading}
      </Typography>
    </div>
  )
}

export default withStyles(styles)(Section)