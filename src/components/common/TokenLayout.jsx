import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing.unit * 200
  }
})

const TokenLayout = ({ classes, meta, actions }) => (
  <Grid container className={classes.root} spacing={16}>
    <Grid item xs={12}>
      <Grid container className={classes.demo} justify="center" spacing={16}>
        <Grid key="meta" item xs={12} sm={3}>
          {meta}
        </Grid>
        <Grid key="actions" item xs={12} sm={9}>
          {actions}
        </Grid>
      </Grid>
    </Grid>
  </Grid>
)

TokenLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

export default withStyles(styles)(TokenLayout)
