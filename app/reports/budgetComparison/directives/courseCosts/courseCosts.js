import { toCurrency } from 'shared/helpers/string';

import './courseCosts.css';

let courseCosts = function (StringService) {
  return {
    restrict: 'E',
    template: require('./courseCosts.html'),
    replace: true,
    scope: {
      year: '<',
      lineItemCategories: '<',
      instructorTypes: '<',
      costs: '<',
      funding: '<',
      miscStats: '<',
      budgetScenarioName: '<'
    },
    link: function (scope) {
      scope.primaryInstructorTypeIds = [6, 9, 8, 5];
      scope.secondaryInstructorTypeIds = [1, 2, 4, 10, 3, 7];

      scope.toCurrency = function (value) {
        return toCurrency(value);
      };

      scope.toAcademicYear = function (year) {
        return StringService.toAcademicYear(year);
      };
    }
  };
};

export default courseCosts;
