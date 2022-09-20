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
      miscStats: '<'
    },
    link: function (scope) {
      scope.primaryInstructorTypeIds = [6, 9, 8, 5];
      scope.secondaryInstructorTypeIds = [1, 2, 4, 10, 3, 7];

      scope.toCurrency = function (value) {
        return toCurrency(value);
      };
    }
  };
};

export default courseCostChanges;
