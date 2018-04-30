let studentFormReview = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentFormReview.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.submitStudentPreferences = function() {
				var newSupportCallResponse = angular.copy(scope.state.supportCallResponse);
				newSupportCallResponse.submitted = true;
				StudentFormActions.submitPreferences(newSupportCallResponse, scope.state.misc.workgroupId, scope.state.misc.year);
			};

			scope.pretendToastMessage = function() {
				StudentFormActions.pretendToastMessage();
			};
		}
	};
};

export default studentFormReview;
