import { toCurrency } from 'shared/helpers/string';

import './supportAndFundChanges.css';

let supportAndFundChanges = function () {
	return {
		restrict: 'E',
		template: require('./supportAndFundChanges.html'),
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

export default supportAndFundChanges;
