import React from 'react';
import PropTypes from 'prop-types';
import DiffCard from './diffCard';

const DiffList = (sections) => {
  return <DiffCard />;
};

DiffList.propTypes = {
  sections: PropTypes.object
};

export default DiffList;