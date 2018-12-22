import { toCurrency } from 'shared/helpers/string';

import './changeTable.css';

let changeTable = function () {
	return {
		restrict: 'E',
		template: require('./changeTable.html'),
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

export default changeTable;
