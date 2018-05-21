import './workloadTotals.css';

let workloadTotals = function () {
	return {
		restrict: 'E',
		template: require('./workloadTotals.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function(scope, element, attrs) {
			// Intentionally blank
		}
	};
};

export default workloadTotals;
