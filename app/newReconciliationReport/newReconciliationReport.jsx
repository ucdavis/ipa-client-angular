import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

const App = ({ title }) => (
  <Button variant="contained" color="primary">
    { title }
  </Button>
);

App.propTypes = {
  title: PropTypes.string
};

export default App;