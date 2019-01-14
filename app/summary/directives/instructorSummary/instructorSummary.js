import './instructorSummary.css';

let instructorSummary = function () {
  return {
    restrict: 'E',
    template: require('./instructorSummary.html'),
    replace: true,
    scope: {
      hasAccess: '=',
      workgroup: '=',
      state: '='
    },
    link: function () {
      // Do nothing
    }
  };
};

export default instructorSummary;
