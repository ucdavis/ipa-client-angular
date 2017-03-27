instructionalSupportApp.service('instructionalSupportCallStatusActionCreators', function ($rootScope, $window, instructionalSupportCallStatusService, supportCallStatusStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			instructionalSupportCallStatusService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addSupportStaffSupportCall: function (scheduleId, studentSupportCall) {
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
				supportCallStatusStateService.reduce(action);
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
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addInstructorsSupportCall: function (scheduleId, supportCallData) {
			// Build addInstructorsDTO
			supportCallData.instructorIds = [];
			// Create an array of invitedParticipantIds
			supportCallData.participantPool.forEach(function(instructor) {
				if (instructor.invited) {
					supportCallData.instructorIds.push(instructor.id);
				}
			});

			// Convert date to Unix time
			supportCallData.dueDate = supportCallData.dueDate.valueOf();

			$rootScope.$emit('toast', { message: "Support Call Created", type: "SUCCESS" });
			instructionalSupportCallStatusService.addInstructorsSupportCall(scheduleId, supportCallData).then(function (payload) {
				var action = {
					type: ADD_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
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
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});