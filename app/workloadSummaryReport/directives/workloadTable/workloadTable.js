import './workloadTable.css';

let workloadTable = function () {
	return {
		restrict: 'E',
		template: require('./workloadTable.html'),
		replace: true,
		scope: {
			instructors: '<',
			totals: '<'
		},
		link: function() {
			// Intentionally blank
		}
	};
};

export default workloadTable;
