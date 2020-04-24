import './reportLegend.css';

let reportLegend = function () {
  return {
    restrict: 'E',
    template: require('./reportLegend.html'),
    replace: true,
    link: function() {
      // Empty intentionally
    }
  };
};

export default reportLegend;
