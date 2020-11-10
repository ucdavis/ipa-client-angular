import { toCurrency } from 'shared/helpers/string';

let teachingBalance = function () {
  return {
    restrict: 'E',
    template: require('./teachingBalance.html'),
    replace: true,
    scope: {
      costs: '<',
      funding: '<',
      expenses: '<'
    },
    link: function (scope) {
      scope.toCurrency = function (value) {
        return toCurrency(value);
      };
    }
  };
};

export default teachingBalance;
