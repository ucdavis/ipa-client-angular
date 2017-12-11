instructionalSupportApp.directive("studentFormReview", this.studentFormReview = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'studentFormReview.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.submitStudentPreferences = function() {
				var newSupportCallResponse = angular.copy(scope.state.supportCallResponse);
				newSupportCallResponse.submitted = true;
				studentActions.submitPreferences(newSupportCallResponse, scope.state.misc.workgroupId, scope.state.misc.year);
			};

			scope.pretendToastMessage = function() {
				studentActions.pretendToastMessage();
			};
		}
	};
});