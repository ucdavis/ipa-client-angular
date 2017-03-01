teachingCallApp.service('teachingCallStatusStateService', function (
	$rootScope, $log, teachingCallStatusSelectors) {
	return {
		_state: {},
		_teachingCallReceiptReducers: function (action, teachingCallReceipts, instructors) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					teachingCallReceipts = {
						ids: [],
						list: []
					};

					action.payload.teachingCallReceipts.forEach( function(teachingCallReceipt) {
						teachingCallReceipt.isSenateInstructor = false;
						teachingCallReceipt.isFederationInstructor = false;

						// Add senate/federation instructor metadata
						if (action.payload.senateInstructorIds.indexOf(teachingCallReceipt.instructorId) > -1) {
							teachingCallReceipt.isSenateInstructor = true;
						}

						if (action.payload.federationInstructorIds.indexOf(teachingCallReceipt.instructorId) > -1) {
							teachingCallReceipt.isFederationInstructor = true;
						}

						// Record to state
						teachingCallReceipts.ids.push(teachingCallReceipt.id);
						teachingCallReceipts.list[teachingCallReceipt.id] = teachingCallReceipt;
					});

					return teachingCallReceipts;
				case CONTACT_INSTRUCTORS:
					// Update the message and nextContactAt fields
					var receiptsPayload = action.payload.teachingCallReceipts;

					receiptsPayload.forEach(function(slotReceipt) {
						var originalReceipt = teachingCallReceipts.list[slotReceipt.id];

						originalReceipt.message = slotReceipt.message;
						originalReceipt.nextContactAt = slotReceipt.nextContactAt;
					});
					return teachingCallReceipts;
				case ADD_INSTRUCTORS_TO_TEACHING_CALL:
					var receiptsPayload = action.payload.teachingCallReceipts;

					receiptsPayload.forEach(function(teachingCallReceipt) {

						teachingCallReceipt.isSenateInstructor = false;
						teachingCallReceipt.isFederationInstructor = false;

						// Add senate/federation instructor metadata
						if (instructors.senateInstructorIds.indexOf(teachingCallReceipt.instructorId) > -1) {
							teachingCallReceipt.isSenateInstructor = true;
						}

						if (instructors.federationInstructorIds.indexOf(teachingCallReceipt.instructorId) > -1) {
							teachingCallReceipt.isFederationInstructor = true;
						}

						// Record to state
						teachingCallReceipts.ids.push(teachingCallReceipt.id);
						teachingCallReceipts.list[teachingCallReceipt.id] = teachingCallReceipt;

					});

					return teachingCallReceipts;
				case REMOVE_INSTRUCTOR_FROM_TEACHING_CALL:
					var receiptId = action.payload.teachingCallReceiptId;
					var index = teachingCallReceipts.ids.indexOf(receiptId);
					teachingCallReceipts.ids.splice(index, 1);

					delete teachingCallReceipts.list[receiptId];

					return teachingCallReceipts;
				default:
					return teachingCallReceipts;
			}
		},
		_instructorReducers: function (action, instructors, teachingCallReceipts) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructors = {
						ids: [],
						list: [],
						senateInstructorIds: [],
						federationInstructorIds: []
					};

					instructors.senateInstructorIds = action.payload.senateInstructorIds;
					instructors.federationInstructorIds = action.payload.federationInstructorIds;

					var length = action.payload.instructors ? action.payload.instructors.length : 0;

					for (i = 0; i < length; i++) {
						var instructor = action.payload.instructors[i];
						instructor.isSenateInstructor = false;
						instructor.isFederationInstructor = false;

						// Add senate/federation instructor metadata
						if (action.payload.senateInstructorIds.indexOf(instructor.id) > -1) {
							instructor.isSenateInstructor = true;
						}

						if (action.payload.federationInstructorIds.indexOf(instructor.id) > -1) {
							instructor.isFederationInstructor = true;
						}

						// Find teachingCallReceiptId if it exists
						instructor.teachingCallReceiptId = 0;

						for (var j = 0; j < action.payload.teachingCallReceipts.length; j++) {
							var teachingCallReceipt = action.payload.teachingCallReceipts[j];
							if (teachingCallReceipt.instructorId == instructor.id) {
								instructor.teachingCallReceiptId = teachingCallReceipt.id;
								break;
							}
						}

						instructors.list[instructor.id] = instructor;
					}

					// Ensure instructors are pre-sorted by last name
					instructors.ids = _array_sortIdsByProperty(instructors.list, ["lastName"]);

					return instructors;
				case ADD_INSTRUCTORS_TO_TEACHING_CALL:
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
			newState = {};
			newState.instructors = scope._instructorReducers(action, scope._state.instructors, angular.copy(scope._state.teachingCallReceipts));
			newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts, angular.copy(scope._state.instructors));
			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.teachingCall = {};
			newPageState.eligible = {};

			newPageState.teachingCall.senate = teachingCallStatusSelectors.generateInstructorGroup(newState.instructors, newState.teachingCallReceipts, true, true, false);
			newPageState.teachingCall.federation = teachingCallStatusSelectors.generateInstructorGroup(newState.instructors, newState.teachingCallReceipts, true, false, true);
			newPageState.eligible.senate = teachingCallStatusSelectors.generateInstructorGroup(newState.instructors, newState.teachingCallReceipts, false, true, false);
			newPageState.eligible.federation = teachingCallStatusSelectors.generateInstructorGroup(newState.instructors, newState.teachingCallReceipts, false, false, true);

			$rootScope.$emit('teachingCallStatusStateChanged', newPageState);

			$log.debug("Teaching Call Status state updated:");
			$log.debug(newPageState, action.type);
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