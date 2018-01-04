supportAssignmentApp.directive("viewAvailabilityModal", this.viewAvailabilityModal = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'viewAvailabilityModal.html',
		replace: true,
		scope: {
			state: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.preference = scope.state.ui.modalPreference;

			scope.close = function() {
				supportActions.closeAvailabilityModal();
				scope.isVisible = false;
			};
		} // end link
	};
});
