instructionalSupportApp.directive("modalPreferenceComments", this.modalPreferenceComments = function ($rootScope, studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'modalPreferenceComments.html',
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.preference = scope.state.ui.modalPreference;

			scope.submitForm = function () {
				studentActions.updatePreferenceComment(scope.state.misc.scheduleId, scope.state.ui.modalPreference);
			};

			scope.close = function() {
				scope.isVisible = false;
			};
		} // end link
	};
});
