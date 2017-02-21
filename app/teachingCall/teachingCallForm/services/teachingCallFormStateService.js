teachingCallApp.service('teachingCallFormStateService', function (
	$rootScope, $log, SectionGroup, Course, ScheduleTermState,
	ScheduleInstructorNote, Term, Tag, Instructor, TeachingAssignment,
	TeachingCall, TeachingCallReceipt, TeachingCallResponse) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						ids: [],
						list: []
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var course = new Course(action.payload.courses[i]);
						coursesList[course.id] = course;
						coursesList[course.id].isFiltered = false;
						coursesList[course.id].isHidden = false;
						// Set all courses to true initially as no tag filters are set
						coursesList[course.id].matchesTagFilters = true;

						// Add the termCode:sectionGroupId pairs
						coursesList[course.id].sectionGroupTermCodeIds = {};

						action.payload.sectionGroups
							.filter(function (sectionGroup) {
								return sectionGroup.courseId === course.id;
							})
							.forEach(function (sectionGroup) {
								coursesList[course.id].sectionGroupTermCodeIds[sectionGroup.termCode] = sectionGroup.id;
							});
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				default:
					return courses;
			}
		},
		_teachingAssignmentReducers: function (action, teachingAssignments) {
			var scope = this;
			var i, payloadTeachingAssignments, slotTeachingAssignment, index;

			switch (action.type) {
				case INIT_STATE:
					teachingAssignments = {
						ids: [],
						list: []
					};
					var teachingAssignmentsList = {};
					var length = action.payload.teachingAssignments ? action.payload.teachingAssignments.length : 0;
					for (i = 0; i < length; i++) {
						var teachingAssignment = new TeachingAssignment(action.payload.teachingAssignments[i]);
						teachingAssignmentsList[teachingAssignment.id] = teachingAssignment;
					}
					teachingAssignments.ids = _array_sortIdsByProperty(teachingAssignmentsList, ["approved"]);
					teachingAssignments.list = teachingAssignmentsList;
					return teachingAssignments;
				case ADD_PREFERENCE:
					// Add a group of teachingAssignments created from a preference
					payloadTeachingAssignments = action.payload.teachingAssignments;
					for (i = 0; i < payloadTeachingAssignments.length; i++) {
						slotTeachingAssignment = payloadTeachingAssignments[i];
						teachingAssignments.list[slotTeachingAssignment.id] = slotTeachingAssignment;
						teachingAssignments.ids.push(slotTeachingAssignment.id);
					}
					return teachingAssignments;
				case REMOVE_PREFERENCE:
					payloadTeachingAssignments = action.payload.teachingAssignments;
					var termCode = action.payload.termCode;
					// For each teachingAssignment associated to that preference
					for (i = 0; i < payloadTeachingAssignments.length; i++) {
						slotTeachingAssignment = payloadTeachingAssignments[i];
						// Remove reference from ids
						index = teachingAssignments.ids.indexOf(slotTeachingAssignment.id);
						if (index > -1) {
							teachingAssignments.ids.splice(index, 1);
						}
						// Remove reference from list
						delete teachingAssignments.list[slotTeachingAssignment.id];
					}
					return teachingAssignments;
				default:
					return teachingAssignments;
			}
		},
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
				default:
					return teachingCalls;
			}
		},
		_activeTeachingCallReducers: function (action, state) {
			var activeTeachingCall = state.activeTeachingCall;
			var i, j, course, termCode;
			switch (action.type) {
				case INIT_STATE:
					payloadActiveTeachingCall = action.payload.activeTeachingCall;
					return payloadActiveTeachingCall;
				case REMOVE_PREFERENCE:
					if (activeTeachingCall == null) {
						return activeTeachingCall;
					}
					var teachingAssignments = action.payload.teachingAssignments;
					termCode = action.payload.termCode;
					var DTOinstructorId = action.payload.instructorId;
					for (i = 0; i < teachingAssignments.length; i++) {
						var slotTeachingAssignment = teachingAssignments[i];
						var index = -1;
						for (j = 0; j < activeTeachingCall.termAssignments[termCode].length; j++) {
							if (activeTeachingCall.termAssignments[termCode][j].id == slotTeachingAssignment.id) {
								index = j;
								break;
							}
						}
						if (index > -1) {
							activeTeachingCall.termAssignments[termCode].splice(index, 1);
						}

						for (var k = 0; k < activeTeachingCall.scheduledCourses[termCode].length; k++) {
							slotCourse = activeTeachingCall.scheduledCourses[termCode][k];
							if (slotTeachingAssignment.sectionGroupId == slotCourse.sectionGroupTermCodeIds[termCode]) {
								slotCourse.hasPreference = false;
							}
						}
					}

					return activeTeachingCall;
				case UPDATE_TEACHING_CALL_RESPONSE:
					return activeTeachingCall;
				default:
					return activeTeachingCall;
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
		_tagReducers: function (action, tags) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					tags = {
						ids: [],
						list: []
					};
					var tagsList = {};
					var length = action.payload.tags ? action.payload.tags.length : 0;
					for (var i = 0; i < length; i++) {
						var tagData = action.payload.tags[i];
						tagsList[tagData.id] = new Tag(tagData);
					}
					tags.ids = _array_sortIdsByProperty(tagsList, "id");
					tags.list = tagsList;
					return tags;
				default:
					return tags;
			}
		},
		_scheduleInstructorNoteReducers: function (action, scheduleInstructorNotes) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					scheduleInstructorNotes = {
						ids: [],
						list: []
					};
					var scheduleInstructorNotesList = {};
					var length = action.payload.scheduleInstructorNotes ? action.payload.scheduleInstructorNotes.length : 0;
					for (var i = 0; i < length; i++) {
						var scheduleInstructorNote = new ScheduleInstructorNote(action.payload.scheduleInstructorNotes[i]);
						scheduleInstructorNotesList[scheduleInstructorNote.id] = scheduleInstructorNote;
					}
					scheduleInstructorNotes.ids = _array_sortIdsByProperty(scheduleInstructorNotesList, ["id"]);
					scheduleInstructorNotes.list = scheduleInstructorNotesList;
					return scheduleInstructorNotes;
				default:
					return scheduleInstructorNotes;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;
			var sectionGroup, i, slotTeachingAssignment, teachingAssignment, index;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						newSectionGroup: {},
						ids: []
					};

					var sectionGroupsList = {};

					var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					for (i = 0; i < length; i++) {
						sectionGroup = new SectionGroup(action.payload.sectionGroups[i]);
						sectionGroupsList[sectionGroup.id] = sectionGroup;
						sectionGroups.ids.push(sectionGroup.id);

						// Create a list of teachingAssignmentIds that are associated to this sectionGroup
						sectionGroupsList[sectionGroup.id].teachingAssignmentIds = [];
						action.payload.teachingAssignments
							.filter(function (teachingAssignment) {
								return teachingAssignment.sectionGroupId === sectionGroup.id;
							})
							.forEach(function (teachingAssignment) {
								sectionGroupsList[sectionGroup.id].teachingAssignmentIds.push(teachingAssignment.id);
							});
					}

					sectionGroups.list = sectionGroupsList;
					return sectionGroups;
				case ADD_PREFERENCE:
					var payloadTeachingAssignments = action.payload.teachingAssignments;
					for (i = 0; i < payloadTeachingAssignments.length; i++) {
						slotTeachingAssignment = payloadTeachingAssignments[i];
						sectionGroup = {};
						if (slotTeachingAssignment.sectionGroupId) {
							sectionGroup = sectionGroups.list[slotTeachingAssignment.sectionGroupId];
							sectionGroup.teachingAssignmentIds.push(slotTeachingAssignment.id);
						}
					}
					return sectionGroups;
				case REMOVE_PREFERENCE:
					var teachingAssignments = action.payload.teachingAssignments;
					var DTOtermCode = action.payload.termCode;
					var DTOinstructorId = action.payload.instructorId;
					for (i = 0; i < teachingAssignments.length; i++) {
						slotTeachingAssignment = teachingAssignments[i];
						sectionGroup = sectionGroups.list[slotTeachingAssignment.sectionGroupId];
						if (sectionGroup) {
							index = sectionGroup.teachingAssignmentIds.indexOf(slotTeachingAssignment.id);
							if (index > -1) {
								sectionGroup.teachingAssignmentIds.splice(index, 1);
							}
						}
					}
					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_filterReducers: function (action, filters) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTagIds: [],
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				default:
					return filters;
			}
		},
		_pageStateReducers: function (action, pageState) {
			var self = this;
			switch (action.type) {
				case INIT_STATE:
					pageState = {
						showUnavailabilities: null, // False
						dueDate: null, // "dec 15th 2016"
						comment: null, // "Only Fridays please"
						isDone: null, // True
						scheduleId: action.payload.scheduleId,
						terms: [],
						instructorId: action.payload.instructorId
					};

					var termsBlob = null;

					// Find Relevant teachingCallReceipt to fill in form config data
					action.payload.teachingCallReceipts.forEach( function(teachingCallReceipt) {
						if (teachingCallReceipt.scheduleId == action.payload.scheduleId
								&& teachingCallReceipt.instructorId == action.payload.instructorId) {

							pageState.isInstructorInTeachingCall = true;
							pageState.showUnavailabilities = teachingCallReceipt.showUnavailabilities;
							pageState.termsBlob = teachingCallReceipt.termsBlob;
							pageState.isDone = teachingCallReceipt.isDone;
							pageState.dueDate = teachingCallReceipt.dueDate;
							pageState.comment = teachingCallReceipt.comment;
							termsBlob = teachingCallReceipt.termsBlob;
						}
					});

					// Scaffold term objects to hold the rest of the data
					pageState.terms = this.scaffoldTermsFromBlob(termsBlob, action.year);

					// Find availabilityBlob data
					action.payload.teachingCallResponses.forEach ( function(teachingCallResponse) {
						pageState.terms.forEach( function(termContainer) {
							if (termContainer.termCode == teachingCallResponse.termCode) {
								termContainer.availabilityBlob = teachingCallResponse.availabilityBlob;
							}
						});
					});


					// Index the payload data for quick searching
					var teachingAssignmentsIndex = {};
					var teachingAssignments = action.payload.teachingAssignments;

					teachingAssignments.forEach( function (assignment) {
						teachingAssignmentsIndex[assignment.id] = assignment;
					});

					pageState.sectionGroupsIndex = {};
					pageState.sectionGroups = action.payload.sectionGroups;

					pageState.sectionGroups.forEach( function (sectionGroup) {
						pageState.sectionGroupsIndex[sectionGroup.id] = sectionGroup;
					});

					pageState.coursesIndex = {};
					pageState.courses = action.payload.courses;

					pageState.courses.forEach( function (course) {
						pageState.coursesIndex[course.id] = course;
					});

					// Process data into preferences, assignments, and scheduledCourses
					pageState.terms.forEach( function(termData) {
						termData.preferences = self.generatePreferences(action.payload.scheduleId, termData.termCode, action.payload.instructorId, teachingAssignments, pageState.sectionGroupsIndex, pageState.coursesIndex);
						termData.assignments = self.generateAssignments(action.payload.scheduleId, termData.termCode, action.payload.instructorId, teachingAssignments, pageState.sectionGroupsIndex, pageState.coursesIndex);
						termData.preferenceOptions = self.generatePreferenceOptions(action.payload.instructorId, termData.termCode, termData.preferences, termData.assignments, pageState.sectionGroups, pageState.coursesIndex);
					});

					return pageState;
				case UPDATE_TEACHING_ASSIGNMENT_ORDER:
					var sortedIds = action.payload.sortedTeachingAssignmentIds;
					var termCode = action.payload.termCode;

					var preferences = null;
					pageState.terms.forEach( function (termContainer) {
						if (termContainer.termCode == termCode) {
							preferences = termContainer.preferences;
						}
					});

					// Update the preference priorities
					sortedIds.forEach( function(preferenceId, index) {
						preferences.forEach( function(preference) {
							if (preference.id == preferenceId) {
								preference.priority = index + 1;
							}
						});
					});

					return pageState;
				case ADD_PREFERENCE:
					var termCode = action.payload.termCode;
					// We're not interested in the potentnial extras that were created for different sequencePatterns
					var newPreference = action.payload.teachingAssignments[0];
					var newPreferenceArray = [];
					newPreferenceArray.push(newPreference);

					var preferenceObjects = this.generatePreferences(pageState.scheduleId, termCode, pageState.instructorId, newPreferenceArray, pageState.sectionGroupsIndex, pageState.coursesIndex);
					var newPreferenceObject = preferenceObjects[0];

					pageState.terms.forEach( function (termContainer) {
						if (termContainer.termCode == termCode) {
							preferences = termContainer.preferences;
						}
					});

					preferences.push(newPreferenceObject);

					return pageState;
				default:
					return pageState;
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
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);
			newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
			newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts);
			newState.teachingCallResponses = scope._teachingCallResponseReducers(action, scope._state.teachingCallResponses);
			newState.teachingCalls = scope._teachingCallReducers(action, scope._state.teachingCalls);
			newState.scheduleInstructorNotes = scope._scheduleInstructorNoteReducers(action, scope._state.scheduleInstructorNotes);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			newState.activeTeachingCall = scope._activeTeachingCallReducers(action, scope._state);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.pageState = scope._pageStateReducers(action, scope._state.pageState);

			scope._state = newState;

			$rootScope.$emit('teachingCallFormStateChanged', scope._state);

			$log.debug("Assignment state updated:");
			$log.debug(scope._state, action.type);
		},

		// Helper Methods
		scaffoldTermsFromBlob: function(termsBlob, academicYear) {
			var self = this;
			var terms = [];
			var allTermsReference = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
			var chronologicalTermsReference = ["05", "06", "07", "08", "09", "10", "01", "02", "03"];

			// Deserialize the termsBlob
			var relevantShortTermCodes = [];

			for ( var i = 0; i < termsBlob.length; i++) {
				var blobFlag = termsBlob.charAt(i);

				if (blobFlag == "1") {
					relevantShortTermCodes.push(allTermsReference[i]);
				}
			}

			// Chronologically order the terms
			var orderedshortTermCodes = [];

			chronologicalTermsReference.forEach( function(term) {
				if (relevantShortTermCodes.indexOf(term) > -1) {
					orderedshortTermCodes.push(term);
				}
			});

			// Scaffold the terms
			orderedshortTermCodes.forEach ( function( term) {
				var termNames = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};

				var slotTerm = {
					termCode: null,
					termDescription: termNames[term],
					assignments: [],
					preferences: [],
					preferenceOptions: []
				};

				slotTerm.termCode = generateTermCode(academicYear, term);
				terms.push(slotTerm);
			});

			return terms;
		},
		// Return flattened objects that can be both preferences or assignments
		// Filtered by termCode and instructor, and whether or not it should be approved
		generateAbstractCourses: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved) {
			var self = this;
			var preferences = [];

			var uniqueAddedPreferences = [];

			teachingAssignments.forEach( function (slotAssignment) {
				// Ensure the assignment is not approved, from the instructor and the term of interest
				if (termCode != slotAssignment.termCode 
				|| instructorId != slotAssignment.instructorId
				|| slotAssignment.approved != approved) {
					return;
				}

				var newPreference = {
					id: slotAssignment.id,
					priority: slotAssignment.priority,
					termCode: slotAssignment.termCode,
					scheduleId: scheduleId,
					description: null,
					instructorId: slotAssignment.instructorId
				};

				var sectionGroup = null;
				var course = null;

				// If this is a SectionGroup based preference
				if (slotAssignment.sectionGroupId > 0) {
					var sectionGroup = sectionGroups[slotAssignment.sectionGroupId];
					var course = courses[sectionGroup.courseId];

					newPreference.sectionGroupId = sectionGroup.id;
					newPreference.courseId = course.id;
					newPreference.subjectCode = course.subjectCode;
					newPreference.courseNumber = course.courseNumber;
					newPreference.effectiveTermCode = course.effectiveTermCode;
					newPreference.title = course.title;
					newPreference.description = newPreference.subjectCode + " " + newPreference.courseNumber;
					newPreference.uniqueIdentifier = newPreference.subjectCode + newPreference.courseNumber + newPreference.effectiveTermCode;

					// Ensure this preference has not already been added

					if (uniqueAddedPreferences.indexOf(newPreference.uniqueIdentifier) > -1) {
						return;
					}

					// Add the preference
					uniqueAddedPreferences.push(newPreference.uniqueIdentifier);
					preferences.push(newPreference);
				}

				// If this is a Non-course preference
				else if (slotAssignment.inResidence || slotAssignment.sabbatical || slotAssignment.courseRelease || slotAssignment.buyout) {
					if (slotAssignment.inResidence) {
						newPreference.description = "In Residence";
						newPreference.inResidence = true;
					} else if (slotAssignment.sabbatical) {
						newPreference.description = "Sabbatical";
						newPreference.sabbatical = true;
					} else if (slotAssignment.courseRelease) {
						newPreference.description = "Course Release";
						newPreference.courseRelease = true;
					} else if (slotAssignment.buyout) {
						newPreference.description = "Buyout";
						newPreference.buyout = true;
					}

					newPreference.uniqueIdentifier = newPreference.description;

					preferences.push(newPreference);
				}

				// If this is a Suggested course preference
				else if (slotAssignment.suggestedCourseNumber) {
					newPreference.isSuggested = true;
					newPreference.courseNumber = slotAssignment.suggestedCourseNumber;
					newPreference.subjectCode = slotAssignment.suggestedSubjectCode;
					newPreference.effectiveTermCode = slotAssignment.suggestedEffectiveTermCode;

					newPreference.suggestedCourseNumber = slotAssignment.suggestedCourseNumber;
					newPreference.suggestedSubjectCode = slotAssignment.suggestedSubjectCode;
					newPreference.suggestedEffectiveTermCode = slotAssignment.suggestedEffectiveTermCode;
				}
				// Unknown preference type
				else {
					console.debug("course not determine the preference type");
					return;
				}
			});

			return preferences;
		},
		generateAllAbstractCourses: function (instructorId, termCode, sectionGroups, courses) {
			var self = this;
			var allCourses = [];

			var uniqueAddedCourses = [];

			sectionGroups.forEach( function (slotSectionGroup) {
				// Ensure the assignment is not approved, from the instructor and the term of interest
				if (termCode != slotSectionGroup.termCode) {
					return;
				}

				var course = courses[slotSectionGroup.courseId];

				// Ensure this preference has not already been added
				var uniqueIdentifier = course.subjectCode + course.courseNumber + course.effectiveTermCode;

				if (uniqueAddedCourses.indexOf(uniqueIdentifier) > -1) {
					return;
				}

				var newCourse = {
					id: slotSectionGroup.id,
					termCode: slotSectionGroup.termCode,
					scheduleId: course.scheduleId,
					sectionGroupId: slotSectionGroup.id,
					courseId: course.id,
					subjectCode: course.subjectCode,
					courseNumber: course.courseNumber,
					effectiveTermCode: course.effectiveTermCode,
					title: course.title,
					description: course.subjectCode + " " + course.courseNumber,
					uniqueIdentifier: uniqueIdentifier,
					instructorId: instructorId
				};

				// Add the preference
				uniqueAddedCourses.push(uniqueIdentifier);
				allCourses.push(newCourse);
			});

			// Sort the courses by subjectCode and then courseNumber
			allCourses = self.sortCourses(allCourses);

			return allCourses;
		},
		generatePreferences: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses) {
			var approved = false;
			return this.generateAbstractCourses(scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved);
		},
		generateAssignments: function (scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses) {
			var approved = true;
			return this.generateAbstractCourses(scheduleId, termCode, instructorId, teachingAssignments, sectionGroups, courses, approved);
		},
		generatePreferenceOptions: function (instructorId, termCode, preferences, assignments, sectionGroups, courses) {
			// Gather all course identifiers that already exist as a preference or assignment
			var courseIdentifiersToFilter = [];

			preferences.forEach( function(preference) {
				courseIdentifiersToFilter.push(preference.uniqueIdentifier);
			});
			assignments.forEach( function(assignment) {
				courseIdentifiersToFilter.push(assignment.uniqueIdentifier);
			});

			var allCourses = this.generateAllAbstractCourses(instructorId, termCode, sectionGroups, courses);

			// Build the scheduledCourses as a subset of all Courses
			var preferenceOptions = [];
			preferenceOptions.push({ isBuyout: true, description: "Buyout" });
			preferenceOptions.push({ isCourseRelease: true, description: "Course Release" });
			preferenceOptions.push({ isSabbatical: true, description: "Sabbatical" });
			preferenceOptions.push({ isInResidence: true, description: "In Residence" });

			allCourses.forEach( function (course) {
				// Skip courses that are already an assignment or preference
				if (courseIdentifiersToFilter.indexOf(course.uniqueIdentifier) > -1) {
					return;
				}

				preferenceOptions.push(course);
			});

			return preferenceOptions;
		},
		sortCourses: function(courses) {
				courses.sort(function (a, b) {
					// Use subject codes to sort if they don't match
					if (a.subjectCode > b.subjectCode) {
						return 1;
					}

					if (a.subjectCode < b.subjectCode) {
						return -1;
					}

					// Subject codes must have matched, use course numbers to sort instead
					if (a.courseNumber > b.courseNumber) {
						return 1;
					}

					if (a.courseNumber < b.courseNumber) {
						return -1;
					}

					return -1;
				});
			return courses;
		},
		generateTermCode: function (year, term) {
			if (term.toString().length == 1) {
				term = "0" + Number(term);
			}

			if (["01", "02", "03"].indexOf(term) >= 0) { year++; }
			var termCode = year + term;

			return termCode;
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