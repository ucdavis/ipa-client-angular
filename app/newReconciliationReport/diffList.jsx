import React from 'react';
import PropTypes from 'prop-types';
import DiffCard from './diffCard';

const DiffList = props => {
  const { sections } = props;

  return sections.map(section => (
    <DiffCard key={section.uniqueKey} section={section} />
  ));
};

DiffList.propTypes = {
  sections: PropTypes.array
};

export default DiffList;
