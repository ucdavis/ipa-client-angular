import { toCurrency } from 'shared/helpers/string';

import './courseCostChanges.css';

let courseCostChanges = function () {
  return {
    restrict: 'E',
    template: require('./courseCostChanges.html'),
    replace: true,
    scope: {
      lineItemCategories: '<',
      instructorTypes: '<',
      costs: '<',
      funding: '<',
      miscStats: '<',
      courseCount: '<'
    },
    link: function (scope) {
      scope.toCurrency = function (value) {
        return toCurrency(value);
      };
    }
  };
};

export default courseCostChanges;
