let appointmentInput = function ($rootScope, SupportActions) {
	return {
		restrict: 'E',
		template: require('./appointmentInput.html'),
		replace: true,
		scope: {
			supportStaff: '<',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope) {
			scope.updateSupportAppointment = function () {
				var type = scope.viewType == "Readers" ? "reader" : "teachingAssistant";

				var appointment = scope.supportStaff.appointment;

				appointment.type = type;
				appointment.supportStaffId = scope.supportStaff.id;

				SupportActions.updateSupportAppointment(scope.supportStaff.appointment);
			};
		}
	};
};

export default appointmentInput;
