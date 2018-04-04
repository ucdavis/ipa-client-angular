teachingCallApp.service('teachingCallStatusActionCreators', function (teachingCallStatusStateService, teachingCallStatusService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			var self = this;

			teachingCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				teachingCallStatusStateService.reduce(action);
				self._calculateInstructorsInCall();
				self._calculateEligibleInstructors();
				self._calculatePendingEmails();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load initial teaching call status state.", type: "ERROR" });
			});
		},
		contactInstructors: function (workgroupId, year, teachingCallConfig, selectedInstructors) {
			var self = this;

			// Turn these instructor view objects into teachingCallReceipts
			var receiptsPayload = selectedInstructors;
			receiptsPayload.forEach( function(instructor) {
				instructor.id = instructor.teachingCallReceiptId;
				instructor.message = teachingCallConfig.message;
				instructor.nextContactAtRaw = instructor.nextContactAt;
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
				self._calculateInstructorsInCall();
				self._calculateEligibleInstructors();
				self._calculatePendingEmails();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not set next email contact.", type: "ERROR" });
			});
		},
		addInstructorsToTeachingCall: function (workgroupId, year, teachingCallConfig) {
			var self = this;
			teachingCallConfig.instructorIds = [];

			teachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
				if(slotInstructor.invited) {
					teachingCallConfig.instructorIds.push(slotInstructor.id);
				}
			});

			delete teachingCallConfig.invitedInstructors;

			// Ensure dueDate is valid or null
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
				self._calculateInstructorsInCall();
				self._calculateEligibleInstructors();
				self._calculatePendingEmails();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add instructors to teaching call.", type: "ERROR" });
			});
		},
		removeInstructorFromTeachingCall: function (workgroupId, year, instructor) {
			var self = this;
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
				self._calculateInstructorsInCall();
				self._calculateEligibleInstructors();
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove instructor from teaching call.", type: "ERROR" });
			});
		},
		toggleInstructor: function(instructorId) {
			var selectedInstructorIds = teachingCallStatusStateService._state.ui.selectedInstructorIds;
			var index = selectedInstructorIds.indexOf(instructorId);

			if (index == -1) {
				selectedInstructorIds.push(instructorId);
			} else {
				selectedInstructorIds.splice(index, 1);
			}

			teachingCallStatusStateService.reduce({
				type: SELECT_INSTRUCTORS,
				payload: {
					selectedInstructorIds: selectedInstructorIds
				}
			});
		},
		selectInstructorsByType: function(instructorTypeId) {
			var instructorIdsToSelect = [];

			teachingCallStatusStateService._state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
				instructorIdsToSelect.push(instructor.instructorId);
			});

			var selectedInstructorIds = _.union(instructorIdsToSelect, teachingCallStatusStateService._state.ui.selectedInstructorIds);

			teachingCallStatusStateService.reduce({
				type: SELECT_INSTRUCTORS,
				payload: {
					selectedInstructorIds: selectedInstructorIds
				}
			});
		},
		unSelectInstructorsByType: function(instructorTypeId) {
			var instructorIdsToRemove = [];

			teachingCallStatusStateService._state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
				instructorIdsToRemove.push(instructor.instructorId);
			});

			var selectedInstructorIds = _.difference(teachingCallStatusStateService._state.ui.selectedInstructorIds, instructorIdsToRemove);

			teachingCallStatusStateService.reduce({
				type: SELECT_INSTRUCTORS,
				payload: {
					selectedInstructorIds: selectedInstructorIds
				}
			});
		},
		// Generate's a DTO that lists all instructors NOT in a teachingCall, broken up by instructorType
		_calculateEligibleInstructors: function() {
			var instructorsEligibleForCall = [];

			teachingCallStatusStateService._state.instructors.ids.forEach(function(instructorId) {
				instructorsEligibleForCall.push(teachingCallStatusStateService._state.instructors.list[instructorId]);
			});

			teachingCallStatusStateService.reduce({
				type: CALCULATE_ELIGIBLE_INSTRUCTORS,
				payload: {
					instructorsEligibleForCall: instructorsEligibleForCall
				}
			});
		},
		// Generates DTO's for each teachingCallReceipt/instructor and sorts them by instructorType
		_calculateInstructorsInCall: function() {
			var teachingCallReceipts = teachingCallStatusStateService._state.teachingCallReceipts;
			var instructorTypes = teachingCallStatusStateService._state.instructorTypes;
			var instructors = teachingCallStatusStateService._state.instructors;

			var teachingCallsByInstructorType = {};
			var instructorsInCalls = false;

			instructorTypes.ids.forEach(function(instructorTypeId) {
				var instructorType = instructorTypes.list[instructorTypeId];
				teachingCallsByInstructorType[instructorTypeId] = [];
			});

			teachingCallReceipts.ids.forEach(function(teachingCallReceiptId) {
				var teachingCallReceipt = teachingCallReceipts.list[teachingCallReceiptId];
				var instructor = instructors.list[teachingCallReceipt.instructorId];

				if (instructor == null) { return; }

				teachingCallReceipt.firstName = instructor.firstName;
				teachingCallReceipt.lastName = instructor.lastName;
				teachingCallReceipt.instructorId = instructor.id;
				teachingCallReceipt.teachingCallReceiptId = teachingCallReceipt.id;
				teachingCallReceipt.lastContactedAt = teachingCallReceipt.lastContactedAt ? moment(teachingCallReceipt.lastContactedAt).format("YYYY-MM-DD").toFullDate() : null;
				teachingCallReceipt.nextContactAtRaw = teachingCallReceipt.nextContactAt;
				teachingCallReceipt.nextContactAt = teachingCallReceipt.nextContactAt ? moment(teachingCallReceipt.nextContactAt).format("YYYY-MM-DD").toFullDate() : null;
				teachingCallReceipt.dueDate = teachingCallReceipt.dueDate ? moment(teachingCallReceipt.dueDate).format("YYYY-MM-DD").toFullDate() : null;

				teachingCallsByInstructorType[instructor.instructorTypeId].push(teachingCallReceipt);

				instructorsInCalls = true;
			});

			teachingCallStatusStateService.reduce({
				type: CALCULATE_INSTRUCTORS_IN_CALL,
				payload: {
					teachingCallsByInstructorType: teachingCallsByInstructorType,
					instructorsInCalls: instructorsInCalls
				}
			});
		},
		_calculatePendingEmails: function() {
			teachingCallStatusStateService._state.teachingCallReceipts.ids.forEach(function(teachingCallReceiptId) {
				var teachingCallReceipt = teachingCallStatusStateService._state.teachingCallReceipts.list[teachingCallReceiptId];

				var haveUnsentEmails = false;

				if (teachingCallReceipt.nextContactAtRaw) {
					var elapsed = elapsedMinutes(teachingCallReceipt.nextContactAtRaw);

					if (elapsed < 10) {
						haveUnsentEmails = true;
					}
				}

				teachingCallStatusStateService.reduce({
					type: CALCULATE_PENDING_EMAILS,
					payload: {
						haveUnsentEmails: haveUnsentEmails
					}
				});
			});
		}
	};
});