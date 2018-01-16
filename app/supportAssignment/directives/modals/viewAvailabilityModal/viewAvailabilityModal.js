supportAssignmentApp.directive("viewAvailabilityModal", this.viewAvailabilityModal = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'viewAvailabilityModal.html',
		replace: true,
		scope: {
			supportStaff: '<',
			isVisible: '='
		},
		link: function (scope, element, attrs) {
			scope.close = function() {
				supportActions.closeAvailabilityModal();
				scope.isVisible = false;
			};
		} // end link
	};
});
