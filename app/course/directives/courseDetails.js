sharedApp.directive("courseDetails", this.courseDetails = function() {
	return {
		restrict: 'E',
		templateUrl: 'courseDetails.html',
		replace: true,
		link: function (scope, element, attrs) {

		}
	}
})