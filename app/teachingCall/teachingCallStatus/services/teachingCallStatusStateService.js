class TeachingCallStatusStateService {
	constructor ($rootScope, $log, ActionTypes) {
		return {
			_state: {},
			_teachingCallReceiptReducers: function (action, teachingCallReceipts, instructors) {
				var scope = this;
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						teachingCallReceipts = {
							ids: [],
							list: []
						};
						action.payload.teachingCallReceipts.forEach( function(teachingCallReceipt) {
							teachingCallReceipts.ids.push(teachingCallReceipt.id);
							teachingCallReceipts.list[teachingCallReceipt.id] = teachingCallReceipt;
						});
						return teachingCallReceipts;
					case ActionTypes.CONTACT_INSTRUCTORS:
						// Update the message and nextContactAt fields
						var receiptsPayload = action.payload.teachingCallReceipts;
	
						receiptsPayload.forEach(function(slotReceipt) {
							var originalReceipt = teachingCallReceipts.list[slotReceipt.id];
							originalReceipt.message = slotReceipt.message;
							originalReceipt.nextContactAt = slotReceipt.nextContactAt;
						});
						return teachingCallReceipts;
					case ActionTypes.ADD_INSTRUCTORS_TO_TEACHING_CALL:
						action.payload.teachingCallReceipts.forEach(function(teachingCallReceipt) {
							if (teachingCallReceipts.ids.indexOf(teachingCallReceipt.id) == -1) {
								teachingCallReceipts.ids.push(teachingCallReceipt.id);
							}
							teachingCallReceipts.list[teachingCallReceipt.id] = teachingCallReceipt;
						});
						return teachingCallReceipts;
					case ActionTypes.REMOVE_INSTRUCTOR_FROM_TEACHING_CALL:
						var receiptId = action.payload.teachingCallReceiptId;
						var index = teachingCallReceipts.ids.indexOf(receiptId);
						teachingCallReceipts.ids.splice(index, 1);
						delete teachingCallReceipts.list[receiptId];
						return teachingCallReceipts;
					default:
						return teachingCallReceipts;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				var scope = this;
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorTypes = {
							ids: [],
							list: {}
						};
						action.payload.instructorTypes.forEach(function(instructorType) {
							instructorTypes.list[instructorType.id] = instructorType;
							instructorTypes.ids.push(instructorType.id);
						});
						return instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_uiReducers: function(action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var ui = {
							selectedInstructorIds: [],
							instructorsInCalls: false,
							haveUnsentEmails: false
						};
						return ui;
					case ActionTypes.CALCULATE_PENDING_EMAILS:
						ui.haveUnsentEmails = action.payload.haveUnsentEmails;
						return ui;
					case ActionTypes.CALCULATE_INSTRUCTORS_IN_CALL:
						ui.instructorsInCalls = action.payload.instructorsInCalls;
						return ui;
					case ActionTypes.SELECT_INSTRUCTORS:
						ui.selectedInstructorIds = action.payload.selectedInstructorIds;
						return ui;
					default:
						return ui;
				}
			},
			_calculationReducers: function(action, calculations) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var calculations = {
							teachingCallsByInstructorType: {},
							instructorsEligibleForCall: {}
						};
						return calculations;
					case ActionTypes.CALCULATE_ELIGIBLE_INSTRUCTORS:
						calculations.instructorsEligibleForCall = action.payload.instructorsEligibleForCall;
						return calculations;
					case ActionTypes.CALCULATE_INSTRUCTORS_IN_CALL:
						calculations.teachingCallsByInstructorType = action.payload.teachingCallsByInstructorType;
						return calculations;
					default:
						return calculations;
				}
			},
			_instructorReducers: function (action, originalInstructors, teachingCallReceipts) {
				var scope = this;
				let instructors = originalInstructors || {
					ids: [],
					list: []
				};

				switch (action.type) {
					case ActionTypes.INIT_STATE:
						// Hashing user values for calculation
						let users = {
							ids: [],
							list: {},
							byLoginId: {}
						};
						action.payload.users.forEach(function(user) {
							users.ids.push(user.id);
							users.list[user.id] = user;
							users.byLoginId[user.loginId] = user;
						});
						let userRoles = {
							ids: [],
							list: {},
							byUserId: {}
						};
						action.payload.userRoles.forEach(function(userRole) {
							userRoles.ids.push(userRole.id);
							userRoles.list[userRole.id] = userRole;
							userRoles.byUserId[userRole.userId] = userRole;
						});
						action.payload.instructors.forEach(function(instructor) {
							var user = users.byLoginId[instructor.loginId];
							// Instructor may not have an associated user
							if (!user) { return; }
	
							var userRole = userRoles.byUserId[user.id];
							instructor.instructorTypeId = userRole.instructorTypeId;
							if (instructors.ids.indexOf(instructor.id) == -1) {
								instructors.ids.push(instructor.id);
							}

							instructors.list[instructor.id] = instructor;
						});
	
						return instructors;
					case ActionTypes.ADD_INSTRUCTORS_TO_TEACHING_CALL:
						action.payload.teachingCallReceipts.forEach(function(slotReceipt) {
							var instructor = instructors.list[slotReceipt.instructorId];
							instructor.teachingCallReceiptId = slotReceipt.id;
						});
	
						return instructors;
					default:
						return instructors;
				}
			},
			reduce: function (action) {
				var scope = this;
	
				// Build new 'state'
				// The 'state' is the normalized source of truth
				let newState = {};
				newState.instructors = scope._instructorReducers(action, scope._state.instructors, angular.copy(scope._state.teachingCallReceipts));
				newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts, angular.copy(scope._state.instructors));
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.calculations = scope._calculationReducers(action, scope._state.calculations);
				newState.ui = scope._uiReducers(action, scope._state.ui);
	
				scope._state = newState;
	
				// Build new 'page state'
				// This is the 'view friendly' version of the store
				let newPageState = {};
				newPageState.instructors = newState.instructors;
				newPageState.instructorTypes = newState.instructorTypes;
				newPageState.calculations = newState.calculations;
				newPageState.ui = newState.ui;
				newPageState.teachingCallReceipts = newState.teachingCallReceipts;
	
				$rootScope.$emit('teachingCallStatusStateChanged', newPageState);
				$log.debug("Teaching Call Status state updated:");
				$log.debug(newPageState, action.type);
			}
		};
	}
}

export default TeachingCallStatusStateService;
