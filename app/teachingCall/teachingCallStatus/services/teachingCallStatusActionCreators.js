teachingCallApp.service('teachingCallStatusActionCreators', function (teachingCallStatusStateService, teachingCallStatusService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			teachingCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		contactInstructors: function (workgroupId, year, teachingCallConfig, selectedInstructors) {
			// Turn these instructor view objects into teachingCallReceipts
			var receiptsPayload = selectedInstructors;
			receiptsPayload.forEach( function(instructor) {
				instructor.id = instructor.teachingCallReceiptId;
				instructor.message = teachingCallConfig.message;
				instructor.nextContactAt = teachingCallConfig.dueDate.getTime();
			});

			teachingCallStatusService.contactInstructors(workgroupId, year, receiptsPayload).then(function (teachingCallReceipts) {
				$rootScope.$emit('toast', { message: "Set next email contact", type: "SUCCESS" });
				var action = {
					type: CONTACT_INSTRUCTORS,
					payload: {
						teachingCallReceipts: teachingCallReceipts
					}
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addInstructorsToTeachingCall: function (workgroupId, year, teachingCallConfig) {
			teachingCallConfig.instructorIds = [];

			teachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
				if(slotInstructor.invited) {
					teachingCallConfig.instructorIds.push(slotInstructor.id);
				}
			});

			delete teachingCallConfig.invitedInstructors;

			// Ensure dueDate is valid or null
			var taco = teachingCallConfig.dueDate.getTime().length;
			var time = teachingCallConfig.dueDate.getTime();
			debugger;

			if (teachingCallConfig.dueDate && teachingCallConfig.dueDate.getTime() > 0) {
				teachingCallConfig.dueDate = teachingCallConfig.dueDate.getTime();
			} else {
				delete teachingCallConfig.dueDate;
			}

			teachingCallStatusService.addInstructorsToTeachingCall(workgroupId, year, teachingCallConfig).then(function (teachingCallReceipts) {
				$rootScope.$emit('toast', { message: "Added to Teaching Call", type: "SUCCESS" });
				var action = {
					type: ADD_INSTRUCTORS_TO_TEACHING_CALL,
					payload: {
						teachingCallReceipts: teachingCallReceipts
					}
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeInstructorFromTeachingCall: function (workgroupId, year, instructor) {
			var receiptId = instructor.teachingCallReceiptId;
			teachingCallStatusService.removeInstructorFromTeachingCall(receiptId).then(function (teachingCallReceiptId) {
				$rootScope.$emit('toast', { message: "Removed from Teaching Call", type: "SUCCESS" });
				var action = {
					type: REMOVE_INSTRUCTOR_FROM_TEACHING_CALL,
					payload: {
						teachingCallReceiptId: teachingCallReceiptId
					}
				};
				teachingCallStatusStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});