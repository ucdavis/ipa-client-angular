supportAssignmentApp.directive("appointmentInput", this.appointmentInput = function ($rootScope, supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'appointmentInput.html',
		replace: true,
		scope: {
			supportStaff: '<',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.updateSupportAppointment = function () {
				var type = scope.viewType == "Readers" ? "reader" : "teachingAssistant";

				var appointment = scope.supportStaff.appointment;

				appointment.type = type;
				appointment.supportStaffId = scope.supportStaff.id;

				supportActions.updateSupportAppointment(scope.supportStaff.appointment);
			};
		}
	};
});
