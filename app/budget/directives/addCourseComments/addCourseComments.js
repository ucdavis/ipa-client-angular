budgetApp.directive("addCourseComments", this.addCourseComments = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'addCourseComments.html',
		replace: true,
		scope: {
			course: '<'
		},
		link: function (scope, element, attrs) {
		} // end link
	};
});
