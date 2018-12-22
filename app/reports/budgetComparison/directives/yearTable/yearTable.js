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

export default yearTable;
