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
					cost: (instructor.cost || "") === "" ? null : parseFloat(instructor.cost.replace(/\D/g,'')),
					reason: instructor.reason,
					sectionGroupCostId: scope.sectionGroupCost.id,
					instructorTypeId: instructor.instructorTypeId
				};
				BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
			};

			scope.removeInstructorCost = function (instructor) {
				BudgetActions.deleteSectionGroupCostInstructor(instructor);
			};
		} // end link
	};
};

export default instructorCosts;
