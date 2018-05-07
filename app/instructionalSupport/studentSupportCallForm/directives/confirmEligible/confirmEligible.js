import './confirmEligible.css';

let confirmEligible = function ($rootScope, StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./confirmEligible.html'),
		replace: true,
		scope: {
			supportCallResponse: '<'
		},
		link: function (scope, element, attrs) {
			var _self = this;
			scope.toggleEligibilityConfirmed = function() {
				scope.supportCallResponse.eligibilityConfirmed = !scope.supportCallResponse.eligibilityConfirmed;

				_self.StudentFormActions.updateSupportCallResponse(scope.supportCallResponse);
			};
		}
	};
};

export default confirmEligible;
