teachingCallApp.service('teachingCallStatusStateService', function (
	$rootScope, $log, SectionGroup, Course, ScheduleTermState,
	ScheduleInstructorNote, Term, Tag, Instructor, TeachingAssignment,
	TeachingCall, TeachingCallReceipt, TeachingCallResponse) {
	return {
		_state: {},
		_teachingCallReducers: function (action, teachingCalls) {
			var scope = this;
			var teachingCall;

			switch (action.type) {
				case INIT_STATE:
					teachingCalls = {
						ids: [],
						list: [],
						eligibleGroups: {}
					};
					teachingCalls.eligibleGroups.senateInstructors = true;
					teachingCalls.eligibleGroups.federationInstructors = true;

					var teachingCallsList = {};
					var length = action.payload.teachingCalls ? action.payload.teachingCalls.length : 0;
					for (var i = 0; i < length; i++) {
						teachingCall = new TeachingCall(action.payload.teachingCalls[i]);
						teachingCallsList[teachingCall.id] = teachingCall;

						// Gather eligible group data
						if (teachingCall.sentToSenate) {
							teachingCalls.eligibleGroups.senateInstructors = false;
						}
						if (teachingCall.sentToFederation) {
							teachingCalls.eligibleGroups.federationInstructors = false;
						}

					}
					teachingCalls.ids = _array_sortIdsByProperty(teachingCallsList, ["id"]);
					teachingCalls.list = teachingCallsList;
					return teachingCalls;
				case CREATE_TEACHING_CALL:
					teachingCall = action.payload.teachingCall;

					if (teachingCall.sentToFederation) {
						teachingCalls.eligibleGroups.federationInstructors = false;
					}
					if (teachingCall.sentToSenate) {
						teachingCalls.eligibleGroups.senateInstructors = false;
					}

					teachingCalls.list[teachingCall.id] = teachingCall;
					teachingCalls.ids.push(teachingCall.id);

					return teachingCalls;
				case DELETE_TEACHING_CALL:
					teachingCall = action.payload.teachingCall;

					if (teachingCall.sentToFederation) {
						teachingCalls.eligibleGroups.federationInstructors = true;
					}
					if (teachingCall.sentToSenate) {
						teachingCalls.eligibleGroups.senateInstructors = true;
					}
					// taco
					teachingCalls.list[teachingCall.id] = null;
					var index = teachingCalls.ids.indexOf(teachingCall.id);
					if (index > -1) {
						teachingCalls.ids.splice(index, 1);
					}
					return teachingCalls;
				default:
					return teachingCalls;
			}
		},
		_teachingCallReceiptReducers: function (action, teachingCallReceipts) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					teachingCallReceipts = {
						ids: [],
						list: []
					};

					var teachingCallReceiptsList = {};
					var length = action.payload.teachingCallReceipts ? action.payload.teachingCallReceipts.length : 0;
					for (var i = 0; i < length; i++) {
						var teachingCallReceipt = new TeachingCallReceipt(action.payload.teachingCallReceipts[i]);
						teachingCallReceiptsList[teachingCallReceipt.id] = teachingCallReceipt;
					}
					teachingCallReceipts.ids = _array_sortIdsByProperty(teachingCallReceiptsList, ["id"]);
					teachingCallReceipts.list = teachingCallReceiptsList;
					return teachingCallReceipts;
				case UPDATE_TEACHING_CALL_RECEIPT:
					teachingCallReceipts.list[action.payload.teachingCallReceipt.id] = action.payload.teachingCallReceipt;
					return teachingCallReceipts;
				default:
					return teachingCallReceipts;
			}
		},
		_teachingCallResponseReducers: function (action, teachingCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					teachingCallResponses = {
						ids: [],
						list: []
					};

					var teachingCallResponsesList = {};
					var length = action.payload.teachingCallResponses ? action.payload.teachingCallResponses.length : 0;
					for (var i = 0; i < length; i++) {
						var teachingCallResponse = new TeachingCallResponse(action.payload.teachingCallResponses[i]);
						teachingCallResponsesList[teachingCallResponse.id] = teachingCallResponse;
					}
					teachingCallResponses.ids = _array_sortIdsByProperty(teachingCallResponsesList, ["id"]);
					teachingCallResponses.list = teachingCallResponsesList;
					return teachingCallResponses;
				case UPDATE_TEACHING_CALL_RESPONSE:
					teachingCallResponses.list[action.payload.teachingCallResponse.id] = action.payload.teachingCallResponse;
					return teachingCallResponses;
				default:
					return teachingCallResponses;
			}
		},
		_instructorReducers: function (action, instructors) {
			var scope = this;
			var i, j, scheduleInstructorNote, instructor, teachingAssignments, termCode, slotTeachingAssignment, teachingAssignment;

			switch (action.type) {
				case INIT_STATE:
					instructors = {
						ids: [],
						list: []
					};
					var instructorsList = {};
					var length = action.payload.instructors ? action.payload.instructors.length : 0;

					// Loop over instructors
					for (i = 0; i < length; i++) {
						instructor = new Instructor(action.payload.instructors[i]);
						instructor.teachingAssignmentTermCodeIds = {};

						// Scaffold all teachingAssignment termCodeId arrays
						var allTerms = ['01', '02', '03', '04', '06', '07', '08', '09', '10'];
						allTerms.forEach(function (slotTerm) {
							var generatedTermCode = generateTermCode(action.year, slotTerm);
							instructor.teachingAssignmentTermCodeIds[generatedTermCode] = [];
						});

						instructor.isFiltered = false;

						// Create arrays of teachingAssignmentIds for each termCode
						for (j = 0; j < action.payload.scheduleTermStates.length; j++) {
							termCode = action.payload.scheduleTermStates[j].termCode;
							instructor.teachingAssignmentTermCodeIds[termCode] = [];

							// Create array of teachingAssignmentIds that are associated to this termCode and instructor
							action.payload.teachingAssignments
								.filter(function (teachingAssignment) {
									return (teachingAssignment.instructorId === instructor.id && teachingAssignment.termCode === termCode);
								})
								.forEach(function (teachingAssignment) {
									instructor.teachingAssignmentTermCodeIds[termCode].push(teachingAssignment.id);
								});
						}

						// Create arrays of teachingCallResponseIds
						instructor.teachingCallResponses = [];

						for (j = 0; j < action.payload.teachingCallResponses.length; j++) {
							var teachingCallResponse = action.payload.teachingCallResponses[j];
							if (teachingCallResponse.instructorId == instructor.id) {
								instructor.teachingCallResponses.push(teachingCallResponse);
							}
						}

						// Find scheduleInstructorNote associated to this instructor, if it exists
						instructor.scheduleInstructorNoteId = null;
						for (j = 0; j < action.payload.scheduleInstructorNotes.length; j++) {
							scheduleInstructorNote = action.payload.scheduleInstructorNotes[j];
							if (scheduleInstructorNote.instructorId == instructor.id) {
								instructor.scheduleInstructorNoteId = scheduleInstructorNote.id;
							}
						}

						// Find teachingCallReceipt associated to this instructor, if it exists
						instructor.teachingCallReceiptId = null;
						for (j = 0; j < action.payload.teachingCallReceipts.length; j++) {
							var teachingCallReceipt = action.payload.teachingCallReceipts[j];
							if (teachingCallReceipt.instructorId == instructor.id) {
								instructor.teachingCallReceiptId = teachingCallReceipt.id;
							}
						}

						instructorsList[instructor.id] = instructor;
					}
					instructors.ids = _array_sortIdsByProperty(instructorsList, ["lastName"]);
					instructors.list = instructorsList;
					return instructors;
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;
					// Specify the properties that we are interested in searching
					var instructorKeyList = ['emailAddress', 'firstName', 'lastName', 'fullName', 'loginId', 'ucdStudentSID'];

					_object_search_properties(query, instructors, instructorKeyList);

					return instructors;
				case ADD_SCHEDULE_INSTRUCTOR_NOTE:
					scheduleInstructorNote = action.payload.scheduleInstructorNote;
					for (i = 0; i < instructors.ids.length; i++) {
						instructor = instructors.list[instructors.ids[i]];
						if (instructor.id == scheduleInstructorNote.instructorId) {
							instructor.scheduleInstructorNoteId = scheduleInstructorNote.id;
						}
					}
					return instructors;
				case ADD_TEACHING_ASSIGNMENT:
					teachingAssignment = action.payload.teachingAssignment;
					instructor = instructors.list[teachingAssignment.instructorId];
					instructor.teachingAssignmentTermCodeIds[teachingAssignment.termCode].push(teachingAssignment.id);
					return instructors;
				case ADD_PREFERENCE:
					teachingAssignments = action.payload.teachingAssignments;
					for (i = 0; i < teachingAssignments.length; i++) {
						slotTeachingAssignment = teachingAssignments[i];
						instructor = instructors.list[slotTeachingAssignment.instructorId];
						instructor.teachingAssignmentTermCodeIds[slotTeachingAssignment.termCode].push(slotTeachingAssignment.id);
					}
					return instructors;
				case REMOVE_PREFERENCE:
					teachingAssignments = action.payload.teachingAssignments;
					termCode = action.payload.termCode;
					var DTOinstructorId = action.payload.instructorId;
					instructor = instructors.list[DTOinstructorId];
					var instructorTeachingAssignments = instructor.teachingAssignmentTermCodeIds[termCode];
					for (i = 0; i < teachingAssignments.length; i++) {
						slotTeachingAssignment = teachingAssignments[i];
						var index = instructorTeachingAssignments.indexOf(slotTeachingAssignment.id);

						if (index > -1) {
							instructorTeachingAssignments.splice(index, 1);
						}
					}
					return instructors;
				case REMOVE_TEACHING_ASSIGNMENT:
					teachingAssignment = action.payload.teachingAssignment;
					instructor = instructors.list[teachingAssignment.instructorId];
					termCode = teachingAssignment.termCode;

					index = instructor.teachingAssignmentTermCodeIds[termCode].indexOf(teachingAssignment.id);

					if (index > -1) {
						instructor.teachingAssignmentTermCodeIds[action.payload.teachingAssignment.termCode].splice(index, 1);
					}

					return instructors;
				default:
					return instructors;
			}
		},
		_scheduleTermStateReducers: function (action, scheduleTermStates) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					scheduleTermStates = {
						ids: []
					};
					var scheduleTermStateList = {};
					var length = action.payload.scheduleTermStates ? action.payload.scheduleTermStates.length : 0;
					for (var i = 0; i < length; i++) {
						var scheduleTermStateData = action.payload.scheduleTermStates[i];
						// Using termCode as key since the scheduleTermState does not have an id
						scheduleTermStateList[scheduleTermStateData.termCode] = new ScheduleTermState(scheduleTermStateData);
					}
					scheduleTermStates.ids = _array_sortIdsByProperty(scheduleTermStateList, "termCode");
					scheduleTermStates.list = scheduleTermStateList;
					return scheduleTermStates;
				default:
					return scheduleTermStates;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;
			var i;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};

					userInterface.instructorId = action.payload.instructorId;
					userInterface.userId = action.payload.userId;

					userInterface.federationInstructorIds = action.payload.federationInstructorIds;
					userInterface.senateInstructorIds = action.payload.senateInstructorIds;
					userInterface.scheduleId = action.payload.scheduleId;

					userInterface.showInstructors = (action.tab == "instructors");
					userInterface.showCourses = (action.tab != "instructors");

					// Set default enabledTerms based on scheduleTermState data
					var enabledTerms = {};
					enabledTerms.list = {};
					enabledTerms.ids = [];
					for (i = 0; i < action.payload.scheduleTermStates.length; i++) {
						var term = action.payload.scheduleTermStates[i].termCode;
						// Generate an id based off termCode
						var id = Number(term.slice(-2));
						enabledTerms.ids.push(id);
					}

					enabledTerms.ids = orderTermsChronologically(enabledTerms.ids);

					// Generate termCode list entries
					for (i = 1; i < 11; i++) {
						// 4 is not used as a termCode
						if (i != 4) {
							var termCode = generateTermCode(action.year, i);
							enabledTerms.list[i] = termCode;
						}
					}

					userInterface.enabledTerms = enabledTerms;

					// Check localStorage for saved termFilter settings
					var termFiltersBlob = localStorage.getItem("termFilters");
					if (termFiltersBlob) {
						userInterface.enabledTerms.ids = deserializeTermFiltersBlob(termFiltersBlob);
					}

					return userInterface;
				case SWITCH_MAIN_VIEW:
					if (userInterface === undefined) {
						userInterface = {};
					}

					userInterface.showCourses = action.payload.showCourses;
					userInterface.showInstructors = action.payload.showInstructors;
					return userInterface;
				case TOGGLE_TERM_FILTER:
					var termId = action.payload.termId;
					var idx = userInterface.enabledTerms.ids.indexOf(termId);
					// A term in the term filter dropdown has been toggled on or off.
					if (idx === -1) {
						// Toggle on
						userInterface.enabledTerms.ids.push(termId);
						userInterface.enabledTerms.ids = orderTermsChronologically(userInterface.enabledTerms.ids);
					} else {
						// Toggle off
						userInterface.enabledTerms.ids.splice(idx, 1);
					}
					var termFiltersBlob = serializeTermFilters(userInterface.enabledTerms.ids);
					localStorage.setItem("termFilters", termFiltersBlob);
					return userInterface;
				default:
					return userInterface;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.scheduleTermStates = scope._scheduleTermStateReducers(action, scope._state.scheduleTermStates);
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);
			newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts);
			newState.teachingCallResponses = scope._teachingCallResponseReducers(action, scope._state.teachingCallResponses);
			newState.teachingCalls = scope._teachingCallReducers(action, scope._state.teachingCalls);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);

			scope._state = newState;

			$rootScope.$emit('teachingCallStatusStateChanged', scope._state);

			$log.debug("Assignment state updated:");
			$log.debug(scope._state, action.type);
		}
	};
});

generateTermCode = function (year, term) {
	if (term.toString().length == 1) {
		term = "0" + Number(term);
	}

	if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
	var termCode = year + term;

	return termCode;
};

// Sorts a list of termIds into chronological order
orderTermsChronologically = function (terms) {
	var orderedTermsReference = [5, 6, 7, 8, 9, 10, 1, 2, 3];
	terms.sort(function (a, b) {
		if (orderedTermsReference.indexOf(a) > orderedTermsReference.indexOf(b)) {
			return 1;
		}
		return -1;
	});

	return terms;
};

// Creates a buildfield to store enabled term filters
// Always 9 digits (skips 4th unused term), and in chronologic order
// Example: "101010001"
serializeTermFilters = function (termFilters) {
	var termsBlob = "";
	var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

	orderedTerms.forEach(function (term) {
		if (termFilters.indexOf(term) > -1) {
			termsBlob += "1";
		} else {
			termsBlob += "0";
		}
	});
	return termsBlob;
};

deserializeTermFiltersBlob = function (termFiltersBlob) {
	var termFiltersArray = [];
	var orderedTerms = [5, 6, 7, 8, 9, 10, 1, 2, 3];

	for (var i = 0; i < orderedTerms.length; i++) {

		if (termFiltersBlob[i] == "1") {
			termFiltersArray.push(orderedTerms[i]);
		}
	}

	return termFiltersArray;
};