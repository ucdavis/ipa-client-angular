class TeachingCallStatusActionCreators {
	constructor (TeachingCallStatusStateService, TeachingCallStatusService, CourseService, $rootScope, $window, Role, ActionTypes, $route) {
		return {
			getInitialState: function (tab) {
				var self = this;
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				CourseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (res) {
					var scheduleHasCourses = res.courses.length !== 0;

					TeachingCallStatusService.getInitialState(workgroupId, year).then(function (payload) {
						var action = {
							type: ActionTypes.INIT_STATE,
							payload: payload,
							year: year,
							tab: tab,
							scheduleHasCourses: scheduleHasCourses
						};
						TeachingCallStatusStateService.reduce(action);
						self._calculateInstructorsInCall();
						self._calculateEligibleInstructors();
						self._calculatePendingEmails();
					}, function () {
						$rootScope.$emit('toast', { message: "Could not load initial teaching call status state.", type: "ERROR" });
					});
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
	
				TeachingCallStatusService.contactInstructors(workgroupId, year, receiptsPayload).then(function (teachingCallReceipts) {
					$rootScope.$emit('toast', { message: "Set next email contact", type: "SUCCESS" });
					var action = {
						type: ActionTypes.CONTACT_INSTRUCTORS,
						payload: {
							teachingCallReceipts: teachingCallReceipts
						}
					};
					TeachingCallStatusStateService.reduce(action);
					self._calculateInstructorsInCall();
					self._calculateEligibleInstructors();
					self._calculatePendingEmails();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not set next email contact.", type: "ERROR" });
				});
			},

			/**
			 * Adds many instructors to a teaching call. This is the primary method for generating
			 * a teaching call.
			 * 
			 * @param {*} workgroupId 
			 * @param {*} year 
			 * @param {*} teachingCallConfig 
			 */
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
	
				TeachingCallStatusService.addInstructorsToTeachingCall(workgroupId, year, teachingCallConfig).then(function (teachingCallReceipts) {
					window.ipa_analyze_event('teaching call', 'called instructors');

					$rootScope.$emit('toast', { message: "Added to Teaching Call", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_INSTRUCTORS_TO_TEACHING_CALL,
						payload: {
							teachingCallReceipts: teachingCallReceipts
						}
					};
					TeachingCallStatusStateService.reduce(action);
					self._calculateInstructorsInCall();
					self._calculateEligibleInstructors();
					self._calculatePendingEmails();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not add instructors to teaching call.", type: "ERROR" });
				});
			},
			removeInstructorFromTeachingCall: function (workgroupId, year, instructor) {
				var self = this;
				var receiptId = instructor.teachingCallReceiptId;
				TeachingCallStatusService.removeInstructorFromTeachingCall(receiptId).then(function (teachingCallReceiptId) {
					$rootScope.$emit('toast', { message: "Removed from Teaching Call", type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_INSTRUCTOR_FROM_TEACHING_CALL,
						payload: {
							teachingCallReceiptId: teachingCallReceiptId
						}
					};
					TeachingCallStatusStateService.reduce(action);
					self._calculateInstructorsInCall();
					self._calculateEligibleInstructors();
					self._calculatePendingEmails();
				}, function () {
					$rootScope.$emit('toast', { message: "Could not remove instructor from teaching call.", type: "ERROR" });
				});
			},
			// Will toggle the selected state (checkbox) for the specified instructor.
			// This is done by adding or removing the instructorId from the 'selectedInstructors' list
			toggleInstructor: function(instructorId) {
				var selectedInstructorIds = TeachingCallStatusStateService._state.ui.selectedInstructorIds;
				var index = selectedInstructorIds.indexOf(instructorId);
	
				if (index == -1) {
					selectedInstructorIds.push(instructorId);
				} else {
					selectedInstructorIds.splice(index, 1);
				}
	
				TeachingCallStatusStateService.reduce({
					type: ActionTypes.SELECT_INSTRUCTORS,
					payload: {
						selectedInstructorIds: selectedInstructorIds
					}
				});
			},
			selectInstructorsByType: function(instructorTypeId) {
				var instructorIdsToSelect = [];
	
				TeachingCallStatusStateService._state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
					instructorIdsToSelect.push(instructor.instructorId);
				});
	
				var selectedInstructorIds = _.union(instructorIdsToSelect, TeachingCallStatusStateService._state.ui.selectedInstructorIds);
	
				TeachingCallStatusStateService.reduce({
					type: ActionTypes.SELECT_INSTRUCTORS,
					payload: {
						selectedInstructorIds: selectedInstructorIds
					}
				});
			},
			unSelectInstructorsByType: function(instructorTypeId) {
				var instructorIdsToRemove = [];
	
				TeachingCallStatusStateService._state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
					instructorIdsToRemove.push(instructor.instructorId);
				});
	
				var selectedInstructorIds = _.difference(TeachingCallStatusStateService._state.ui.selectedInstructorIds, instructorIdsToRemove);
	
				TeachingCallStatusStateService.reduce({
					type: ActionTypes.SELECT_INSTRUCTORS,
					payload: {
						selectedInstructorIds: selectedInstructorIds
					}
				});
			},
			// Generate's a DTO that lists all instructors NOT in a teachingCall, broken up by instructorType
			_calculateEligibleInstructors: function() {
				var instructorsEligibleForCall = [];
	
				TeachingCallStatusStateService._state.instructors.ids.forEach(function(instructorId) {
					instructorsEligibleForCall.push(TeachingCallStatusStateService._state.instructors.list[instructorId]);
				});
	
				TeachingCallStatusStateService.reduce({
					type: ActionTypes.CALCULATE_ELIGIBLE_INSTRUCTORS,
					payload: {
						instructorsEligibleForCall: instructorsEligibleForCall
					}
				});
			},
			// Generates DTO's for each teachingCallReceipt/instructor and sorts them by instructorType
			_calculateInstructorsInCall: function() {
				var teachingCallReceipts = TeachingCallStatusStateService._state.teachingCallReceipts;
				var instructorTypes = TeachingCallStatusStateService._state.instructorTypes;
				var instructors = TeachingCallStatusStateService._state.instructors;
	
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
					teachingCallReceipt.lastContactedAt = teachingCallReceipt.lastContactedAt ? moment(teachingCallReceipt.lastContactedAt).format("YYYY-MM-DD").toFullDate() : null; // eslint-disable-line no-undef
					teachingCallReceipt.nextContactAtRaw = teachingCallReceipt.nextContactAt;
					teachingCallReceipt.nextContactAt = teachingCallReceipt.nextContactAt ? moment(teachingCallReceipt.nextContactAt).format("YYYY-MM-DD").toFullDate() : null; // eslint-disable-line no-undef
					teachingCallReceipt.dueDate = teachingCallReceipt.dueDate ? moment(teachingCallReceipt.dueDate).format("YYYY-MM-DD").toFullDate() : null; // eslint-disable-line no-undef
	
					teachingCallsByInstructorType[instructor.instructorTypeId].push(teachingCallReceipt);
	
					instructorsInCalls = true;
				});
	
				TeachingCallStatusStateService.reduce({
					type: ActionTypes.CALCULATE_INSTRUCTORS_IN_CALL,
					payload: {
						teachingCallsByInstructorType: teachingCallsByInstructorType,
						instructorsInCalls: instructorsInCalls
					}
				});
			},
			_calculatePendingEmails: function() {
				TeachingCallStatusStateService._state.teachingCallReceipts.ids.forEach(function(teachingCallReceiptId) {
					var teachingCallReceipt = TeachingCallStatusStateService._state.teachingCallReceipts.list[teachingCallReceiptId];
	
					var haveUnsentEmails = false;
	
					if (teachingCallReceipt.nextContactAtRaw) {
	
						if (elapsedMinutes(teachingCallReceipt.nextContactAtRaw) >= 0) {
							haveUnsentEmails = true;
						}
					}
	
					TeachingCallStatusStateService.reduce({
						type: ActionTypes.CALCULATE_PENDING_EMAILS,
						payload: {
							haveUnsentEmails: haveUnsentEmails
						}
					});
				});
			}
		};
	}
}

export default TeachingCallStatusActionCreators;
