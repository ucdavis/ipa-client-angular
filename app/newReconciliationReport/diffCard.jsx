import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles({
  card: {
    maxWidth: '50%'
  },
  buttonGroup: {
    justifyContent: 'space-around'
  }
});

const DiffCard = (section) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardHeader title="Intro to Programming" subheader="ECS 032A - A01" />
      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">CRN</TableCell>
              <TableCell align="right">Seats</TableCell>
              <TableCell align="right">Activity</TableCell>
              <TableCell align="right">Days</TableCell>
              <TableCell align="right">Start</TableCell>
              <TableCell align="right">End</TableCell>
              <TableCell align="right">Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>IPA</TableCell>
              <TableCell align="right">12345</TableCell>
              <TableCell align="right">45</TableCell>
              <TableCell align="right">Lecture</TableCell>
              <TableCell align="right">MWF</TableCell>
              <TableCell align="right">9am</TableCell>
              <TableCell align="right">10am</TableCell>
              <TableCell align="right">Everson 119</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Banner</TableCell>
              <TableCell align="right">12345</TableCell>
              <TableCell align="right">50</TableCell>
              <TableCell align="right">Lecture</TableCell>
              <TableCell align="right">MWF</TableCell>
              <TableCell align="right">11am</TableCell>
              <TableCell align="right">12pm</TableCell>
              <TableCell align="right">Chem 123</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <CardActions className={classes.buttonGroup}>
        <Button variant="contained" size="small">
          Update IPA
        </Button>
        <Button variant="contained" size="small">
          Banner To-Do
        </Button>
      </CardActions>
    </Card>
  );
};

DiffCard.propTypes = {
  section: PropTypes.object
};

export default DiffCard;
