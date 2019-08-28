import { toCurrency } from 'shared/helpers/string';

let teachingBalanceChanges = function () {
  return {
    restrict: 'E',
    template: require('./teachingBalanceChanges.html'),
    replace: true,
    scope: {
      costs: '<',
      funding: '<'
    },
    link: function (scope) {
      scope.toCurrency = function (value) {
        return toCurrency(value);
      };
    }
  };
};

export default teachingBalanceChanges;
