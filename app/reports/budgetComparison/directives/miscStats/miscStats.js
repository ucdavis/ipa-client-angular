import { toCurrency } from 'shared/helpers/string';

import './miscStats.css';

let miscStats = function (StringService) {
	return {
		restrict: 'E',
		template: require('./miscStats.html'),
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

export default miscStats;
