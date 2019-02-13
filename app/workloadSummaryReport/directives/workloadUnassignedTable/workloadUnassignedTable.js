import '../workloadTable/workloadTable.css';

let workloadUnassignedTable = function () {
	return {
		restrict: 'E',
		template: require('./workloadUnassignedTable.html'),
		replace: true,
		scope: {
			courses: '<',
			totals: '<'
		},
		link: function() {
			// Intentionally blank
		}
	};
};

export default workloadUnassignedTable;
