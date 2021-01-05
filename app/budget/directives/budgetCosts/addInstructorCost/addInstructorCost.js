import './addInstructorCost.css';

let addInstructorCost = function () {
	return {
		restrict: 'A',
		template: require('./addInstructorCost.html'),
		scope: {
			instructor: '<',
			sectionGroupCost: '<',
			instructorAssignmentOptions: '<',
			divider: '<',
			isLiveData: '<',
			instructorCount: '<',
			isBudgetRequest: '<'
		},
		replace: true,
		link: function (scope) {
			scope.assignmentLink = function (){
				return '/assignments/' + JSON.parse(localStorage.getItem('workgroup')).id + '/' + localStorage.getItem('year') + '/?tab=courses';
			};
		}
	};
};

export default addInstructorCost;
