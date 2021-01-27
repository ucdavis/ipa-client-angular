import './reportFilter.css';

let reportFilter = function () {
  return {
    restrict: 'E',
    template: require('./reportFilter.html'),
    replace: true,
    link: function () {
      // Intentionally blank
    },
  };
};

export default reportFilter;
