import './workloadTotals.css';

let workloadTotals = function () {
	return {
		restrict: 'E',
		template: require('./workloadTotals.html'),
		replace: true,
		scope: {
			workloadTotals: '<'
		},
		link: function() {
			// Intentionally blank
		}
	};
};

export default workloadTotals;
