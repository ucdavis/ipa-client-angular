import React from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

const BannerActivities = props => {
  const { activities, sectionDiff } = props;

  return activities.map(activity => {
    if (activity.dwChanges) {
      return (
        <TableRow key={activity.uniqueKey}>
          <TableCell>Banner</TableCell>
          <TableCell align="right">
            {sectionDiff.crn ? sectionDiff.crn.value : ''}
          </TableCell>
          <TableCell align="right">
            {sectionDiff.seats ? sectionDiff.seats.value : ''}
          </TableCell>
          <TableCell align="right">{activity.typeCode}</TableCell>
          <TableCell align="right">
            {activity.dwChanges.dayIndicator
              ? activity.dwChanges.dayIndicator.value
              : ''}
          </TableCell>
          <TableCell align="right">
            {activity.dwChanges.startTime
              ? activity.dwChanges.startTime.value
              : ''}
          </TableCell>
          <TableCell align="right">
            {activity.dwChanges.endTime ? activity.dwChanges.endTime.value : ''}
          </TableCell>
          <TableCell align="right">
            {activity.dwChanges.bannerLocation
              ? activity.dwChanges.bannerLocation.value
              : ''}
          </TableCell>
        </TableRow>
      );
    }
  });
};

BannerActivities.propTypes = {
  activities: PropTypes.array,
  sectionDiff: PropTypes.object
};

export default BannerActivities;
