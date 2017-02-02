instructionalSupportApp.service('instructionalSupportCallStatusActionCreators', function ($rootScope, $window, instructionalSupportCallStatusService, instructionalSupportCallStatusStateService) {
	return {
		getInitialState: function (workgroupId, year) {
			instructionalSupportCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addStudentSupportCall: function (scheduleId, studentSupportCall) {
			// Remove participants that were disabled in the UI
			filteredParticipants = [];
			studentSupportCall.participantPool.forEach( function(participant) {
				if (participant.enabled == true) {
					filteredParticipants.push(participant);
				}
			});

			studentSupportCall.participantPool = filteredParticipants;

			$rootScope.$emit('toast', { message: "Support Call Created", type: "SUCCESS" });
			instructionalSupportCallStatusService.addStudentSupportCall(scheduleId, studentSupportCall).then(function (payload) {
				var action = {
					type: ADD_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteStudentSupportCall: function (studentSupportCall) {
			$rootScope.$emit('toast', { message: "Support Call Removed", type: "SUCCESS" });
			instructionalSupportCallStatusService.deleteStudentSupportCall(studentSupportCall).then(function (payload) {
				var action = {
					type: DELETE_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addInstructorSupportCall: function (scheduleId, instructorSupportCall) {

			// Remove participants that were disabled in the UI
			filteredParticipants = [];
			instructorSupportCall.participantPool.forEach( function(participant) {
				if (participant.enabled == true) {
					filteredParticipants.push(participant);
				}
			});

			instructorSupportCall.participantPool = filteredParticipants;

			$rootScope.$emit('toast', { message: "Support Call Created", type: "SUCCESS" });
			instructionalSupportCallStatusService.addInstructorSupportCall(scheduleId, instructorSupportCall).then(function (payload) {
				var action = {
					type: ADD_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteInstructorSupportCall: function (instructorSupportCall) {
			$rootScope.$emit('toast', { message: "Support Call Removed", type: "SUCCESS" });
			instructionalSupportCallStatusService.deleteInstructorSupportCall(instructorSupportCall).then(function (payload) {
				var action = {
					type: DELETE_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				instructionalSupportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});