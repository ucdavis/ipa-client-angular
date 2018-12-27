import './studentFormReview.css';

let studentFormReview = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./studentFormReview.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope) {
			scope.submitStudentPreferences = function() {
				var newSupportCallResponse = angular.copy(scope.state.supportCallResponse); // eslint-disable-line no-undef
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
