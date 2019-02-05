import { toCurrency } from 'shared/helpers/string';

import './miscStatChanges.css';

let miscStatChanges = function () {
  return {
    restrict: 'E',
    template: require('./miscStatChanges.html'),
    replace: true,
    scope: {
      lineItemCategories: '<',
      instructorTypes: '<',
      costs: '<',
      funding: '<',
      miscStats: '<',
    },
    link: function (scope) {
      scope.toCurrency = function (value) {
        return toCurrency(value);
      };
    }
  };
};

export default miscStatChanges;
