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

import IpaActivities from './ipaActivities';

const useStyles = makeStyles({
  card: {
    maxWidth: '50%',
    margin: '20px'
  },
  buttonGroup: {
    justifyContent: 'space-around'
  }
});

const DiffCard = props => {
  const classes = useStyles();
  const { section } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        title={section.title}
        subheader={`${section.subjectCode} ${section.courseNumber} - ${section.sequenceNumber}`}
      />
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
            <IpaActivities
              crn={section.crn}
              seats={section.seats}
              activities={section.activities}
            ></IpaActivities>
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
