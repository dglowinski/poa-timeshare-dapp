import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Balance from 'components/common/Balance'
import PoaBuyToken from 'components/poa/PoaBuyToken'
import poaActions from 'actions/poa'


const mapStateToProps = state => {
  return {
    metaMaskBalance: state.poa.metaMaskBalance,
    tokenDetails: state.poa.tokenDetails,
    buyLoading: state.poa.buyLoading,
    available: state.poa.available
  }
}

const mapDispatchToProps = dispatch => {
  const { getMetaMaskBalance, getTokenDetails, buyToken, getAvailable } = bindActionCreators(poaActions, dispatch)
  return {
    getMetaMaskBalance,
    getTokenDetails,
    buyToken,
    getAvailable,
  }
}

const styles = {
  card: {
    minWidth: 275,
    height:300,
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
};

class PoaOperations extends React.Component {

  componentDidMount() {
    const { getMetaMaskBalance, getAvailable } = this.props
    getMetaMaskBalance()
    getAvailable()
  }
 
  render() {
    const { classes, buyToken, buyLoading, metaMaskBalance, tokenDetails, getAvailable, available } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              PoA token interface
            </Typography>
            <Typography className={classes.title} color="textSecondary">
              Name: <b>{tokenDetails.name}</b> symbol: <b>{tokenDetails.symbol}</b> decimals: <b>{tokenDetails.decimals}</b>
              <span> <a target="blank" href={"https://ropsten.etherscan.io/address/"+tokenDetails.address}>Etherscan</a></span>
            </Typography>
            <Typography className={classes.title} color="textSecondary">
              Balance of MetaMask account: {metaMaskBalance || "-"}
            </Typography>
            <Balance token="PoA" />
            <PoaBuyToken handleBuy={buyToken} loading={buyLoading} getAvailable={getAvailable} available={available}/>
          </CardContent>
        </Card>
      </div>
    );
  }
}

PoaOperations.propTypes = {
  classes: PropTypes.object.isRequired,
  buyToken: PropTypes.func.isRequired,
  buyTokenLoading: PropTypes.bool,
  metaMaskBalance: PropTypes.string,
  getMetaMaskBalance: PropTypes.func.isRequired,
  getTokenDetails: PropTypes.func.isRequired,
  tokenDetails: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PoaOperations));