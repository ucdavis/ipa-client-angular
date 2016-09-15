sharedApp.directive("newCourse", this.newCourse = function() {
	return {
		restrict: 'E',
		templateUrl: 'newCourse.html',
		replace: true,
		link: function (scope, element, attrs) {

		}
	}
})