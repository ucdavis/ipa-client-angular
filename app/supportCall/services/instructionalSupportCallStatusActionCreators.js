supportCallApp.service('instructionalSupportCallStatusActionCreators', function ($rootScope, $window, instructionalSupportCallStatusService, supportCallStatusStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			instructionalSupportCallStatusService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					workgroupId: workgroupId,
					termShortCode: termShortCode
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not set support call status initial state.", type: "ERROR" });
			});
		},
		addSupportStaffSupportCall: function (scheduleId, supportCallData) {
			// Build addInstructorsDTO
			supportCallData.studentIds = [];
			// Create an array of invitedParticipantIds
			supportCallData.participantPool.forEach(function(student) {
				if (student.invited) {
					supportCallData.studentIds.push(student.id);
				}
			});

			// Convert date to Unix time
			if (supportCallData.dueDate) {
				supportCallData.dueDate = supportCallData.dueDate.valueOf();
			}

			instructionalSupportCallStatusService.addStudentsSupportCall(scheduleId, supportCallData).then(function (payload) {
				$rootScope.$emit('toast', { message: "Students added to support call", type: "SUCCESS" });
				var action = {
					type: ADD_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add students to support call.", type: "ERROR" });
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
			if (supportCallData.dueDate) {
				supportCallData.dueDate = supportCallData.dueDate.valueOf();
			}

			instructionalSupportCallStatusService.addInstructorsSupportCall(scheduleId, supportCallData).then(function (payload) {
				$rootScope.$emit('toast', { message: "Instructors added to support call", type: "SUCCESS" });
				var action = {
					type: ADD_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add instructors to support call.", type: "ERROR" });
			});
		},
		contactInstructorsSupportCall: function (scheduleId, supportCallData) {
			supportCallData.responseIds = [];

			supportCallData.selectedParticipants.forEach(function(participant) {
				supportCallData.responseIds.push(participant.supportCallResponseId);
			});

			// Convert date to Unix time
			if (supportCallData.dueDate) {
				supportCallData.dueDate = supportCallData.dueDate.valueOf();
			}

			instructionalSupportCallStatusService.contactInstructorsSupportCall(scheduleId, supportCallData).then(function (payload) {
				$rootScope.$emit('toast', { message: "Instructor contact scheduled", type: "SUCCESS" });
				var action = {
					type: CONTACT_INSTRUCTOR_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not schedule instructor contact.", type: "ERROR" });
			});
		},
		contactSupportStaffSupportCall: function (scheduleId, supportCallData) {
			supportCallData.responseIds = [];

			supportCallData.selectedParticipants.forEach(function(participant) {
					supportCallData.responseIds.push(participant.supportCallResponseId);
			});

			// Convert date to Unix time
			if (supportCallData.dueDate) {
				supportCallData.dueDate = supportCallData.dueDate.valueOf();
			}

			instructionalSupportCallStatusService.contactSupportStaffSupportCall(scheduleId, supportCallData).then(function (payload) {
				$rootScope.$emit('toast', { message: "Student contact scheduled", type: "SUCCESS" });
				var action = {
					type: CONTACT_STUDENT_SUPPORT_CALL,
					payload: payload
				};
				supportCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not schedule student contact.", type: "ERROR" });
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
				$rootScope.$emit('toast', { message: "Could not remove instructor from support call.", type: "ERROR" });
			});
		},
		removeSupportStaffFromSupportCall: function (supportStaff, scheduleId, termCode) {
			instructionalSupportCallStatusService.removeStudentFromSupportCall(supportStaff, scheduleId, termCode).then(function (supportCallResponseId) {
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
				$rootScope.$emit('toast', { message: "Could not remove student from support call.", type: "ERROR" });
			});
		}
	};
});