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
      budgetScenarioName: '<',
      instructorTypeCourses: '<',
      unassigned: '<'
    },
    link: function (scope) {
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
