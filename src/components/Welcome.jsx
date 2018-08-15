import React from 'react'
import Typography from '@material-ui/core/Typography';
import { withStyles, CardContent, Card } from '@material-ui/core';

const styles = theme => ({
  title: {
    fontSize: 14,
    display: 'block',
    margin:20
  }
})

export default withStyles(styles)(classes => (
  <Card>
    <CardContent>
      <Typography variant="headline" gutterBottom style={{margin:10}}>
        PoA token with timeshare Ðapp
      </Typography>
      <Typography className={classes.title} color="textSecondary" style={{margin:10}}>
        This project is based on a Proof of Asset token concept, where tokens on ethereum blockchain represent an ownership of a physical asset like for example an apartment building. In this project a PoA ERC20 token is implemented. Owners of a property may be entitled to dividends from the revenue of the property. In this project instead of a dividend, the owners of PoA token participate directly - they are entitled to timeshare of the property. PoA tokens generate a timeshare balance for each holder in the form of Timeshare Token TST. For simplicity it is assumed, that the property can be used on a day to day basis. The total supply of PoA generates 1 TST token per day, and holders of PoA are entitled to claim TST token in proportion to their PoA balance over time, such that the sum total will always represent 1 TST per day. Thay can claim and transfer any amount of TST, but only when they own at least 1 TST, they can use it to book the property for 1 day. The TST token tracks the bookings calendar and ensures any given day can only be booked once. When the day is booked, the TST token is burned.    
      </Typography>
      <Typography className={classes.title} color="textSecondary" style={{margin:10}}>
        Additionally TST can be used to control physical access to the property. After the booking is made, the renter signes a timestamp with his private key, and this represents an access key, possibly stored in a mobile application. To access the property he sends his key to a smart lock, which calls the TST contract, which in turn verifies the signature to check that the booking was made for a given address and timestamp and replies to the smart lock to grant or prevent access. 
      </Typography>
      <Typography className={classes.title} color="textSecondary" style={{margin:10}}>
        Additionally TST can be used to control physical access to the property. After the booking is made, the renter signes a timestamp with his private key, and this represents an access key, possibly stored in a mobile application. To access the property he sends his key to a smart lock, which calls the TST contract, which in turn verifies the signature to check that the booking was made for a given address and timestamp and replies to the smart lock to grant or prevent access. 
      </Typography>
      <Typography variant="subheading" gutterBottom style={{margin:10}}>
        Features
      </Typography>
      <Typography className={classes.title} color="textSecondary" style={{margin:10}}>
        <ul>
          <li>get the details of both tokens: name, symbol, decimals, meta data (description, link to photos etc.)</li>
          <li>check balance of an ethereum address - both tokens</li>
          <li>check balance of current address - MetaMask or local - both tokens</li>
          <li>transfer both tokens</li>
          <li>buy PoA tokens with Ether</li>
          <li>check available timeshare balance in PoA of current account and claim TST token</li>
          <li>check available days in TST, make a booking, sign timestamp and receive access key</li>
          <li>verify the access key for selected day.</li>
        </ul>
      </Typography>
    </CardContent>
  </Card>
))
