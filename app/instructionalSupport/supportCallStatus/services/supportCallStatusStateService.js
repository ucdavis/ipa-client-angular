instructionalSupportApp.service('supportCallStatusStateService', function (
	$rootScope, $log, supportCallStatusSelectors) {
	return {
		_state: {},
		_supportStaffSupportCallResponseReducers: function (action, supportStaffSupportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaffSupportCallResponses = {
						ids: [],
						list: []
					};

					action.payload.studentSupportCallResponses.forEach( function(supportResponse) {
						// Record to state
						supportStaffSupportCallResponses.ids.push(supportResponse.id);
						supportStaffSupportCallResponses.list[supportResponse.id] = supportResponse;
					});

					return supportStaffSupportCallResponses;
				case DELETE_STUDENT_SUPPORT_CALL:
					var supportCallResponseId = action.payload;

					var index = supportStaffSupportCallResponses.ids.indexOf(supportCallResponseId);
					supportStaffSupportCallResponses.ids.splice(index, 1);

					return supportStaffSupportCallResponses;
				case ADD_STUDENT_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
						supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
					});

					return supportStaffSupportCallResponses;
				case CONTACT_STUDENT_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
						supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
					});

					return supportStaffSupportCallResponses;
				default:
					return supportStaffSupportCallResponses;
			}
		},
		_instructorSupportCallResponseReducers: function (action, instructorSupportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructorSupportCallResponses = {
						ids: [],
						list: []
					};

					action.payload.instructorSupportCallResponses.forEach( function(supportResponse) {
						// Record to state
						instructorSupportCallResponses.ids.push(supportResponse.id);
						instructorSupportCallResponses.list[supportResponse.id] = supportResponse;
					});

					return instructorSupportCallResponses;
				case DELETE_INSTRUCTOR_SUPPORT_CALL:
					var supportCallResponseId = action.payload.supportCallResponseId;

					var index = instructorSupportCallResponses.ids.indexOf(supportCallResponseId);
					instructorSupportCallResponses.ids.splice(index, 1);

					return instructorSupportCallResponses;
				case ADD_INSTRUCTOR_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						instructorSupportCallResponses.ids.push(supportCallResponse.id);
						instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
					});

					return instructorSupportCallResponses;
				case CONTACT_INSTRUCTOR_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						instructorSupportCallResponses.ids.push(supportCallResponse.id);
						instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
					});

					return instructorSupportCallResponses;
				default:
					return instructorSupportCallResponses;
			}
		},
		_instructorReducers: function (action, instructors, instructorSupportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructors = {
						ids: [],
						list: []
					};

					action.payload.activeInstructors.forEach( function(instructor) {
						// Find teachingCallReceiptId if it exists
						instructor.teachingCallReceiptId = 0;

						for (var i = 0; i < action.payload.instructorSupportCallResponses.length; i++) {
							var instructorResponse = action.payload.instructorSupportCallResponses[i];
							if (instructorResponse.instructorId == instructor.id) {
								instructor.supportCallResponseId = instructorResponse.id;
								break;
							}
						}

						instructor.isInstructor = true;

						instructors.list[instructor.id] = instructor;
					});

					// Ensure instructors are pre-sorted by last name
					instructors.ids = _array_sortIdsByProperty(instructors.list, ["lastName"]);

					return instructors;
				case DELETE_INSTRUCTOR_SUPPORT_CALL:
					var instructorId = action.payload.instructorId;
					instructors.list[instructorId].supportCallResponseId = null;
					return instructors;
				case ADD_INSTRUCTOR_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						var instructor = instructors.list[supportCallResponse.instructorId];
						instructor.supportCallResponseId = supportCallResponse.id;
					});

					return instructors;
				default:
					return instructors;
			}
		},
		_supportStaffReducers: function (action, supportStaff, supportStaffSupportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaff = {
						ids: [],
						list: [],
						mastersIds: [],
						phdIds: [],
						instructionalSupportIds: []
					};

					supportStaff.mastersIds = action.payload.mastersStudentIds;
					supportStaff.phdIds = action.payload.phdStudentIds;
					supportStaff.instructionalSupportIds = action.payload.instructionalSupportIds;

					action.payload.supportStaffList.forEach( function(slotSupportStaff) {

						// Identify type of supportStaff
						slotSupportStaff.isMasters = (supportStaff.mastersIds.indexOf(slotSupportStaff.id) > -1);
						slotSupportStaff.isPhd = (supportStaff.phdIds.indexOf(slotSupportStaff.id) > -1);
						slotSupportStaff.isInstructionalSupport = (supportStaff.instructionalSupportIds.indexOf(slotSupportStaff.id) > -1);

						// Find teachingCallReceiptId if it exists
						slotSupportStaff.supportCallResponseId = 0;

						for (var i = 0; i < action.payload.studentSupportCallResponses.length; i++) {
							var supportStaffResponse = action.payload.studentSupportCallResponses[i];
							if (supportStaffResponse.supportStaffId == slotSupportStaff.id) {
								slotSupportStaff.supportCallResponseId = supportStaffResponse.id;
								break;
							}
						}

						supportStaff.list[slotSupportStaff.id] = slotSupportStaff;
					});

					// Ensure instructors are pre-sorted by last name
					supportStaff.ids = _array_sortIdsByProperty(supportStaff.list, ["lastName"]);

					return supportStaff;
				case DELETE_STUDENT_SUPPORT_CALL:
					var supportStaffId = action.payload.supportStaffId;
					supportStaff.list[supportStaffId].supportCallResponseId = null;

					return supportStaff;
				case ADD_STUDENT_SUPPORT_CALL:
					action.payload.forEach(function(supportCallResponse) {
						var supportStaffDTO = supportStaff.list[supportCallResponse.supportStaffId];
						supportStaffDTO.supportCallResponseId = supportCallResponse.id;
					});

					return supportStaff;
				default:
					return supportStaff;
			}
		},
		_miscReducers: function (action, misc) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					misc = {
						scheduleId: action.payload.scheduleId,
						year: action.year,
						nextYearShort: (parseInt(action.year) + 1).toString().slice(-2),
						termShortCode: action.termShortCode,
						workgroupId: action.workgroupId
					};
					return misc;
				default:
					return misc;
			}
		},
		reduce: function (action) {
			var scope = this;

			// Build new 'state'
			// The 'state' is the normalized source of truth
			newState = {};
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);
			newState.instructorSupportCallResponses = scope._instructorSupportCallResponseReducers(action, scope._state.instructorSupportCallResponses);
			newState.supportStaff = scope._supportStaffReducers(action, scope._state.supportStaff);
			newState.supportStaffSupportCallResponses = scope._supportStaffSupportCallResponseReducers(action, scope._state.supportStaffSupportCallResponses);
			newState.misc = scope._miscReducers(action, scope._state.misc);

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.supportCall = {};
			newPageState.eligible = {};
			newPageState.misc = {};

			newPageState.supportCall.instructors = supportCallStatusSelectors.generateInstructorGroup(angular.copy(scope._state.instructors), angular.copy(scope._state.instructorSupportCallResponses), false);

			newPageState.supportCall.masters = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "masters");
			newPageState.supportCall.phds = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "phd");
			newPageState.supportCall.instructionalSupports = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "instructionalSupport");
			newPageState.supportCall.supportStaff = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), false, "all");

			newPageState.eligible.instructors = supportCallStatusSelectors.generateInstructorGroup(angular.copy(scope._state.instructors), angular.copy(scope._state.instructorSupportCallResponses), true);

			newPageState.eligible.masters = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "masters");
			newPageState.eligible.phds = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "phd");
			newPageState.eligible.instructionalSupports = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "instructionalSupport");
			newPageState.eligible.supportStaff = supportCallStatusSelectors.generateSupportStaffGroup(angular.copy(scope._state.supportStaff), angular.copy(scope._state.supportStaffSupportCallResponses), true, "all");

			newPageState.misc = angular.copy(scope._state.misc);

			$rootScope.$emit('supportCallStatusStateChanged', newPageState);
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