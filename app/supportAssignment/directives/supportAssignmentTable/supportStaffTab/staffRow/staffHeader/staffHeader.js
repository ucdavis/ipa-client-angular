supportAssignmentApp.directive("staffHeader", this.staffHeader = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'staffHeader.html',
		replace: true,
		scope: {
			supportStaff: '<',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.openAvailabilityModal = function(supportStaff) {
				supportActions.openAvailabilityModal(supportStaff);
			};
		}
	};
});
