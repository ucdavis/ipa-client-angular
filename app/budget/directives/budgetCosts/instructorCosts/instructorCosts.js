import './instructorCosts.css';

let instructorCosts = function (BudgetActions) {
	return {
		restrict: 'A',
		template: require('./instructorCosts.html'),
		scope: {
			instructor: '<',
		},
		replace: true,
		link: function (scope) {
			console.log('instructor row scope ', scope);
			scope.updateInstructorCost = function (instructor) {
				console.log('Updating cost ', instructor);
				// We already have an entry for this user
				if (instructor.sectionGroupCostInstructorId){
					console.log('Updating, already exists');
					var sectionGroupCost = {
						id: instructor.sectionGroupCostInstructorId,
						instructorId: instructor.id,
						cost: parseFloat(instructor.cost.replace(/\D/g,'')),
						sectionGroupCostId: instructor.sectionGroupCostId
					};
					BudgetActions.updateSectionGroupCostInstructor(sectionGroupCost);
				} else {
					var sectionGroupCost = {
						instructorId: instructor.id,
						cost: parseFloat(instructor.cost.replace(/\D/g,'')),
						sectionGroupCostId: instructor.sectionGroupCostId
					};
					BudgetActions.createSectionGroupCostInstructor(sectionGroupCost);
				}
			};
		} // end link
	};
};

export default instructorCosts;
