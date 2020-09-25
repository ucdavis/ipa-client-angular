import './addInstructorAssignmentDropdown.css'

let addInstructorAssignmentDropdown = function (BudgetActions) {
	return {
		restrict: 'E',
		template: require('./addInstructorAssignmentDropdown.html'),
		replace: true,
		scope: {
			mode: '<',
			sectionGroupCost: '<',
			instructors: '<'
		},
		link: function (scope) {
			scope.setInstructor = function(instructor) {
				var sectionGroupCost = {
						cost: null,
						sectionGroupCostId: scope.sectionGroupCost.id
				};
				if (instructor.isInstructorType){
					sectionGroupCost.instructorTypeId = instructor.id;
				} else {
					sectionGroupCost.instructorTypeId = instructor.instructorType.id;
					sectionGroupCost.instructorId = instructor.id;
				}

				BudgetActions.createSectionGroupCostInstructors([sectionGroupCost]);
			};
		}
	};
};

export default addInstructorAssignmentDropdown;
