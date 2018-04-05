instructionalSupportApp.directive("studentQualifications", this.studentQualifications = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentQualifications.html',
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateStudentQualifications = function() {
				studentActions.updateStudentQualifications(scope.supportCallResponse);
			};
		}
	};
});
