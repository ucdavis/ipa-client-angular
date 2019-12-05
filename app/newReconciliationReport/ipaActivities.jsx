import React from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const IpaActivities = props => {
  const { crn, seats, activities } = props;

  return activities.map((activity, index) => {
    const firstActivityRow = index === 0 ? <TableCell>IPA</TableCell> : <TableCell />;

    return (
      <TableRow key={activity.uniqueKey}>
        {firstActivityRow}
        <TableCell align="right">{crn}</TableCell>
        <TableCell align="right">{seats}</TableCell>
        <TableCell align="right">{activity.typeCode}</TableCell>
        <TableCell align="right">{activity.dayIndicator}</TableCell>
        <TableCell align="right">{activity.startTime}</TableCell>
        <TableCell align="right">{activity.endTime}</TableCell>
        <TableCell align="right">{activity.bannerLocation}</TableCell>
      </TableRow>
    );
});
};

IpaActivities.propTypes = {
  crn: PropTypes.string,
  seats: PropTypes.number,
  activities: PropTypes.array
};

export default IpaActivities;
