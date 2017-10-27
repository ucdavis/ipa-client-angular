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
			scope.updateSectionGroupCost = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.displayProperty = function(sectionGroupCost, propertyName) {
				budgetActions.toggleSectionGroupCostDetail(sectionGroupCost.id, propertyName);
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};
		} // end link
	};
});
