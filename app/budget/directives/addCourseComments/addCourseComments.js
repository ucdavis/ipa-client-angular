budgetApp.directive("addCourseComments", this.addCourseComments = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addCourseComments.html',
		replace: true,
		scope: {
			sectionGroupCost: '<'
		},
		link: function (scope, element, attrs) {
		} // end link
	};
});
