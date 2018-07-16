import './yearTable.css';

let yearTable = function (StringService) {
	return {
		restrict: 'E',
		template: require('./yearTable.html'),
		replace: true,
		scope: {
			year: '<',
			lineItemCategories: '<',
			instructorTypes: '<',
			costs: '<',
			funding: '<',
			miscStats: '<',
		},
		link: function (scope, element, attrs) {
			scope.toCurrency = function (value) {
				return toCurrency(value);
			};

			scope.yearToAcademicYear = function (year) {
				return StringService.yearToAcademicYear(year);
			};
		}
	};
};

export default yearTable;
