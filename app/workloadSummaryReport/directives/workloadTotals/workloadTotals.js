import './workloadTotals.css';

let workloadTotals = function () {
	return {
		restrict: 'E',
		template: require('./workloadTotals.html'),
		replace: true,
		scope: {
			workloadTotals: '<',
			combinedTotals: '<'
		},
		link: function() {
			// Intentionally blank
		}
	};
};

export default workloadTotals;
