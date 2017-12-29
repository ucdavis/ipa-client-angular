supportAssignmentApp.directive("appointmentInput", this.appointmentInput = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'appointmentInput.html',
		replace: true,
		scope: {
			supportStaff: '<',
			viewType: '<'
		},
		link: function (scope, element, attrs) {
			scope.updateAppointment = function () {
				// TODO: trigger appropriate update action
			};
		}
	};
});
