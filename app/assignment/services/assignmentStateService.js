/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentStateService', function (
	$rootScope, $log, SectionGroup, Course, ScheduleTermState,
	ScheduleInstructorNote, Term, Tag, Instructor, TeachingAssignment,
	TeachingCall, TeachingCallReceipt, TeachingCallResponse) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;

					// Apply search filters
					if (query.length > 0) {
						// Specify the properties that we are interested in searching
						var courseKeyList = ['courseNumber', 'sequencePattern', 'subjectCode', 'title'];

						_object_search_properties(query, courses, courseKeyList);
					} else {
						courses.ids.forEach(function(courseId) {
							courses.list[courseId].isFiltered = false;
						});
					}

					return courses;
				case UPDATE_TAG_FILTERS:
					// Set the course.isFiltered flag to false if any tag matches the filters
					courses.ids.forEach(function (courseId) {
						// Display all courses if none of the tags is checked
						if (action.payload.tagIds.length === 0) {
							courses.list[courseId].matchesTagFilters = true;
						} else {
							courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
								.some(function (tagId) {
									return action.payload.tagIds.indexOf(tagId) >= 0;
								});
						}
					});
					return courses;
				default:
					return courses;
			}
		},
		_teachingAssignmentReducers: function (action, teachingAssignments) {
			var scope = this;
			var i, payloadTeachingAssignments, slotTeachingAssignment, index;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
				case UPDATE_TEACHING_ASSIGNMENT:
					teachingAssignments.list[action.payload.teachingAssignment.id] = action.payload.teachingAssignment;
					return teachingAssignments;
				case ADD_TEACHING_ASSIGNMENT:
					teachingAssignments.list[action.payload.teachingAssignment.id] = action.payload.teachingAssignment;
					teachingAssignments.ids.push(action.payload.teachingAssignment.id);
					return teachingAssignments;
				case REMOVE_TEACHING_ASSIGNMENT:
					index = teachingAssignments.ids.indexOf(action.payload.teachingAssignment.id);
					if (index > -1) {
						teachingAssignments.ids.splice(index, 1);
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
				case INIT_ASSIGNMENT_VIEW:
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
		_teachingCallReceiptReducers: function (action, teachingCallReceipts) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
				case INIT_ASSIGNMENT_VIEW:
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
				case INIT_ASSIGNMENT_VIEW:
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

					if (query.length > 0) {
						// Specify the properties that we are interested in searching
						var instructorKeyList = ['emailAddress', 'firstName', 'lastName', 'fullName', 'loginId', 'ucdStudentSID'];

						_object_search_properties(query, instructors, instructorKeyList);
					} else {
						instructors.ids.forEach(function (instructorId) {
							instructors.list[instructorId].isFiltered = false;
						});
					}

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
				case REMOVE_TEACHING_ASSIGNMENT:
					teachingAssignment = action.payload.teachingAssignment;
					instructor = instructors.list[teachingAssignment.instructorId];

					if (!instructor) {
						return instructors;
					}

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
		_instructorMasterListReducers: function (action, instructorMasterList) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
					instructorMasterList = {
						ids: [],
						list: []
					};

					action.payload.instructorMasterList.forEach( function (slotInstructor) {
						instructorMasterList.ids.push(slotInstructor.id);
						instructorMasterList.list[slotInstructor.id] = slotInstructor;
					});

					return instructorMasterList;
				default:
					return instructorMasterList;
			}
		},
		_supportAssignmentReducers: function (action, supportAssignments) {
			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
					supportAssignments = {
						ids: [],
						list: []
					};
					action.payload.supportAssignments.forEach(function (supportAssignment) {
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;
					});
					return supportAssignments;
				default:
					return supportAssignments;
			}
		},
		_scheduleTermStateReducers: function (action, scheduleTermStates) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
				case INIT_ASSIGNMENT_VIEW:
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
				case INIT_ASSIGNMENT_VIEW:
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
				case UPDATE_SCHEDULE_INSTRUCTOR_NOTE:
					scheduleInstructorNotes.list[action.payload.scheduleInstructorNote.id] = action.payload.scheduleInstructorNote;
					return scheduleInstructorNotes;
				case ADD_SCHEDULE_INSTRUCTOR_NOTE:
					scheduleInstructorNotes.list[action.payload.scheduleInstructorNote.id] = action.payload.scheduleInstructorNote;
					scheduleInstructorNotes.ids.push(action.payload.scheduleInstructorNote.id);
					return scheduleInstructorNotes;
				default:
					return scheduleInstructorNotes;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;
			var sectionGroup, i, slotTeachingAssignment, teachingAssignment, index;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
				case ADD_TEACHING_ASSIGNMENT:
					teachingAssignment = action.payload.teachingAssignment;
					sectionGroup = {};
					if (teachingAssignment.sectionGroupId) {
						sectionGroup = sectionGroups.list[teachingAssignment.sectionGroupId];
						sectionGroup.teachingAssignmentIds.push(teachingAssignment.id);
					}
					return sectionGroups;
				case REMOVE_TEACHING_ASSIGNMENT:
					teachingAssignment = action.payload.teachingAssignment;
					sectionGroup = sectionGroups.list[teachingAssignment.sectionGroupId];
					if (sectionGroup) {
						index = sectionGroup.teachingAssignmentIds.indexOf(teachingAssignment.id);
						if (index > -1) {
							sectionGroup.teachingAssignmentIds.splice(index, 1);
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
				case INIT_ASSIGNMENT_VIEW:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTagIds: [],
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				case UPDATE_TAG_FILTERS:
					filters.enabledTagIds = action.payload.tagIds;
					return filters;
				case TOGGLE_UNPUBLISHED_COURSES:
					filters.enableUnpublishedCourses = !filters.enableUnpublishedCourses;
					filters.enabledTagIds = [];
					return filters;
				case TOGGLE_COMPLETED_INSTRUCTORS:
					filters.showCompletedInstructors = action.payload.showCompletedInstructors;
					return filters;
				default:
					return filters;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;
			var i;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.instructors = scope._instructorReducers(action, scope._state.instructors);
			newState.instructorMasterList = scope._instructorMasterListReducers(action, scope._state.instructorMasterList);
			newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
			newState.teachingCallReceipts = scope._teachingCallReceiptReducers(action, scope._state.teachingCallReceipts);
			newState.teachingCallResponses = scope._teachingCallResponseReducers(action, scope._state.teachingCallResponses);
			newState.teachingCalls = scope._teachingCallReducers(action, scope._state.teachingCalls);
			newState.scheduleInstructorNotes = scope._scheduleInstructorNoteReducers(action, scope._state.scheduleInstructorNotes);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.supportAssignments = scope._supportAssignmentReducers(action, scope._state.supportAssignments);

			scope._state = newState;

			$rootScope.$emit('assignmentStateChanged', scope._state);

			$log.debug("Assignment state updated:");
			$log.debug(scope._state, action.type);
			console.log(scope._state);
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