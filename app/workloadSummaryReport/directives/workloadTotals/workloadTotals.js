import './workloadTotals.css';

let workloadTotals = function () {
	return {
		restrict: 'E',
		template: require('./workloadTotals.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function(scope) {
			scope.workloadTotals = [scope.state.calculations.calculatedView.totals, scope.state.calculations.calculatedView.unassignedTotals, scope.state.calculations.calculatedView.genericInstructorTotals];

			scope.combinedTotals = {
				instructorCount: 0,
				assignmentCount: 0,
				enrollment: 0,
				seats: 0,
				previousEnrollment: 0,
				units: 0,
				studentCreditHours: 0
			};

			scope.combinedTotals = scope.workloadTotals.reduce(function (acc, total) {
				acc.instructorCount += total.instructorCount || 0;
				acc.assignmentCount += total.assignmentCount || 0;
				acc.enrollment += total.enrollment || 0;
				acc.seats += total.seats || 0;
				acc.previousEnrollment += total.previousEnrollment || 0;
				acc.units += total.units || 0;
				acc.studentCreditHours += total.studentCreditHours || 0;

				return acc;
			}, scope.combinedTotals);
		}
	};
};

export default workloadTotals;
