supportAssignmentApp.directive("courseAppointmentInput", this.courseAppointmentInput = function (supportActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseAppointmentInput.html',
		replace: true,
		scope: {
			sectionGroup: '=',
			viewType: '<',
			readOnly: '<?'
		},
		link: function (scope, element, attrs) {
			scope.updateTeachingAssistantAppointments = function () {
				scope.sectionGroup.teachingAssistantAppointments = parseFloat(scope.sectionGroup.teachingAssistantAppointments);
				supportActions.updateTeachingAssistantAppointments(scope.sectionGroup);
			};

			scope.updateReaderAppointments = function() {
				scope.sectionGroup.readerAppointments = parseFloat(scope.sectionGroup.readerAppointments);
				supportActions.updateReaderAppointments(scope.sectionGroup);
			};
		}
	};
});
