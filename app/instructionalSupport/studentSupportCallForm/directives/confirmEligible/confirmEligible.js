instructionalSupportApp.directive("confirmEligible", this.confirmEligible = function ($rootScope, studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'confirmEligible.html',
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			scope.toggleEligibilityConfirmed = function() {
				scope.supportCallResponse.eligibilityConfirmed = !scope.supportCallResponse.eligibilityConfirmed;

				studentActions.updateSupportCallResponse(scope.supportCallResponse);
			};
		}
	};
});