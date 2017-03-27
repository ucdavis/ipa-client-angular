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

		// ---- TODO: Refactor this
		addSupportStaffSupportCall: function (scheduleId, studentSupportCall) {
			// Remove participants that were disabled in the UI
			filteredParticipants = [];
			studentSupportCall.participantPool.forEach( function(participant) {
				if (participant.enabled == true) {
					filteredParticipants.push(participant);
				}
			});

			studentSupportCall.participantPool = filteredParticipants;

			instructionalSupportCallStatusService.addStudentSupportCall(scheduleId, studentSupportCall).then(function (payload) {
				$rootScope.$emit('toast', { message: "Support Call Created", type: "SUCCESS" });

				var action = {
					type: ADD_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		// -------

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

			instructionalSupportCallStatusService.addInstructorsSupportCall(scheduleId, supportCallData).then(function (payload) {
				$rootScope.$emit('toast', { message: "Support Call Created", type: "SUCCESS" });
				var action = {
					type: ADD_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeInstructorFromSupportCall: function (instructor, scheduleId, termCode) {
			instructionalSupportCallStatusService.removeInstructorFromSupportCall(instructor, scheduleId, termCode).then(function (supportCallResponseId) {
				$rootScope.$emit('toast', { message: "Instructor removed from support call", type: "SUCCESS" });
				var action = {
					type: DELETE_INSTRUCTOR_SUPPORT_CALL,
					payload: {
						supportCallResponseId: supportCallResponseId,
						instructorId: instructor.id
					}
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeSupportStaffFromSupportCall: function (supportStaff, scheduleId, termCode) {
			instructionalSupportCallStatusService.removeInstructorFromSupportCall(supportStaff, scheduleId, termCode).then(function (supportCallResponseId) {
				$rootScope.$emit('toast', { message: "Student removed from support call", type: "SUCCESS" });
				var action = {
					type: DELETE_STUDENT_SUPPORT_CALL,
					payload: {
						supportCallResponseId: supportCallResponseId,
						supportStaffId: supportStaff.id
					}
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});