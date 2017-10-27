budgetApp.directive("courseCostRow", this.courseCostRow = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCostRow.html',
		replace: true,
		scope: {
			sectionGroupCost: '<',
			course: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateSectionGroupCost = function(sectionGroupCost) {
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};
		} // end link
	};
});
