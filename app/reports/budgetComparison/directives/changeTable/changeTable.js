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
		link: function (scope, element, attrs) {
			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		}
	};
};

export default changeTable;
