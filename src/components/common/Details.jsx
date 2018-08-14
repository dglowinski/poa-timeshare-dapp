import React from 'react'
import { Typography } from '@material-ui/core';

export default ({details: {name, symbol, decimals, address}, classes}) => (
  <Typography className={classes.title} color="textSecondary" >
    Name: <b>{name}</b> symbol: <b>{symbol}</b> decimals: <b>{decimals}</b>
    <span> <a target="blank" href={"https://ropsten.etherscan.io/address/"+address}>Etherscan</a></span>
  </Typography>
)