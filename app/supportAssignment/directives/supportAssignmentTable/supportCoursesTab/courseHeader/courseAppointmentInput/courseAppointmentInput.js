let courseAppointmentInput = function (SupportActions) {
	return {
		restrict: 'E',
		template: require('./courseAppointmentInput.html'),
		replace: true,
		scope: {
			sectionGroup: '=',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.updateTeachingAssistantAppointments = function () {
				scope.sectionGroup.teachingAssistantAppointments = parseFloat(scope.sectionGroup.teachingAssistantAppointments);
				SupportActions.updateTeachingAssistantAppointments(scope.sectionGroup);
			};

			scope.updateReaderAppointments = function() {
				scope.sectionGroup.readerAppointments = parseFloat(scope.sectionGroup.readerAppointments);
				SupportActions.updateReaderAppointments(scope.sectionGroup);
			};
		}
	};
};

export default courseAppointmentInput;
