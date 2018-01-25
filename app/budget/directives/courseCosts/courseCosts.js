budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<',
			termNav: '<',
			calculatedSectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};

			scope.updateSectionGroupCost = function(sectionGroupCost) {
				budgetActions.updateSectionGroupCost(sectionGroupCost);
			};

			scope.openCourseComments = function(course) {
				budgetActions.openAddCourseCommentsModal(course);
			};
		} // end link
	};
});
