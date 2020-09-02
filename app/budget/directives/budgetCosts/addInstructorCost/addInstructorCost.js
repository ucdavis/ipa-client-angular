import './addInstructorCost.css';

let addInstructorCost = function () {
	return {
		restrict: 'A',
		template: require('./addInstructorCost.html'),
		scope: {
			instructor: '<',
			sectionGroupCost: '<',
			instructorAssignmentOptions: '<',
			divider: '<'
		},
		replace: true,
	};
};

export default addInstructorCost;
