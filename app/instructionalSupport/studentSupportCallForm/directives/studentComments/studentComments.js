instructionalSupportApp.directive("studentComments", this.studentComments = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentComments.html',
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateStudentComments = function() {
				studentActions.updateStudentComments(scope.supportCallResponse);
			};
		}
	};
});
