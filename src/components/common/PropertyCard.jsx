import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    maxWidth: 345,
    height: 300,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
};

const PropertyCard = props => {
  const { classes, image, description } = props;
  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={image}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            Property details
          </Typography>
          <Typography component="p">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

PropertyCard.propTypes = {
  classes: PropTypes.object.isRequired,
  image: PropTypes.string,
  descrition: PropTypes.string,
};

export default withStyles(styles)(PropertyCard);