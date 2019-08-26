import { toCurrency } from 'shared/helpers/string';

let teachingBalance = function (StringService) {
  return {
    restrict: 'E',
    template: require('./teachingBalance.html'),
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
      scope.toCurrency = function (value) {
        return toCurrency(value);
      };

      scope.toAcademicYear = function (year) {
        return StringService.toAcademicYear(year);
      };
    }
  };
};

export default teachingBalance;
