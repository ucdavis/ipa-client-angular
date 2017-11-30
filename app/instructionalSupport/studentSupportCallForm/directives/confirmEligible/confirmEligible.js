instructionalSupportApp.directive("confirmEligible", this.confirmEligible = function () {
	return {
		restrict: 'E',
		templateUrl: 'confirmEligible.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank

			scope.toggleEligibilityConfirmed = function() {
				scope.props.supportCallResponse.eligibilityConfirmed = !scope.props.supportCallResponse.eligibilityConfirmed;

				studentActions.updateSupportCallResponse(scope.props.supportCallResponse);
			};
		}
	};
});