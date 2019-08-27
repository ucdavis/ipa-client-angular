import { toCurrency } from 'shared/helpers/string';

let teachingBalanceChanges = function (StringService) {
  return {
    restrict: 'E',
    template: require('./teachingBalanceChanges.html'),
    replace: true,
    scope: {
      teachingBalance: '<',
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

export default teachingBalanceChanges;