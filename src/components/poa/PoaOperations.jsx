import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Balance from 'components/common/Balance'
import BalanceMetaMask from 'components/common/BalanceMetaMask'
import poaActions from 'actions/poa'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  const { getMetaMaskBalance } = bindActionCreators(poaActions, dispatch)
  return {
    getMetaMaskBalance
  }
}

const styles = {
  card: {
    minWidth: 275,
    height:300,
  },
};

const SimpleCard = props => {
  const { classes } = props;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="headline" component="h2">
            PoA token interface
          </Typography>
          <Balance token="PoA" />
          <BalanceMetaMask token="PoA" />
        </CardContent>
      </Card>
    </div>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SimpleCard));