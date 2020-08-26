import './instructorCosts.css';

let instructorCosts = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCosts.html'),
		scope: {
			instructor: '<',
			originalInstructor: '<',
			sectionGroupCost: '<',
			instructorAssignmentOptions: '<'
		},
		replace: true,
		link: function (scope) {
			scope.updateInstructorCost = function (instructor) {

				var sectionGroupCost = {
					id: instructor.id,
					instructorId: instructor.instructorId,
					cost: parseFloat((instructor.cost || '0.0').replace(/\D/g,'')),
					reason: instructor.reason,
					sectionGroupCostId: scope.sectionGroupCost.id
				};
				BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
			};
		} // end link
	};
};

export default instructorCosts;
