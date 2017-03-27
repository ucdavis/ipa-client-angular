instructionalSupportApp.service('instructionalSupportStudentFormStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						ids: []
					};
					var sectionGroupsList = {};

					var coursesLength = action.payload.courses ? action.payload.courses.length : 0;
					var sectionGroupsLength = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;

					// For every course, find the relevant sectionGroup and add metadata to it from the course
					for (var i = 0; i < coursesLength; i++) {
						var courseData = action.payload.courses[i];

						for (var j = 0; j < sectionGroupsLength; j++) {
							var sectionGroupData = action.payload.sectionGroups[j];
							if (sectionGroupData.courseId === courseData.id) {
								sectionGroup = new SectionGroup(sectionGroupData);
								sectionGroup.subjectCode = courseData.subjectCode;
								sectionGroup.sequencePattern = courseData.sequencePattern;
								sectionGroup.courseNumber = courseData.courseNumber;
								sectionGroup.title = courseData.title;
								sectionGroup.units = courseData.unitsLow;

								sectionGroupsList[sectionGroupData.id] = sectionGroup;
								sectionGroups.ids.push(sectionGroupData.id);
							}
						}
					}

					// Put together sectionGroup state data
					sectionGroups.ids = sortCourseIds(sectionGroups.ids, sectionGroupsList);
					sectionGroups.list = sectionGroupsList;

					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						ids: [],
						list: []
					};

					var coursesLength = action.payload.courses ? action.payload.courses.length : 0;

					for (var i = 0; i < coursesLength; i++) {
						var courseData = action.payload.courses[i];

							courses.list[courseData.id] = courseData;
							courses.ids.push(courseData.id);
					}

					return courses;
				default:
					return courses;
			}
		},
		_potentialPreferenceReducers: function (action, potentialPreferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					potentialPreferences = {
						readers: [],
						teachingAssistants: [],
						associateInstructors: []
					};

					var supportAssignmentsLength = action.payload.instructionalSupportAssignments ? action.payload.instructionalSupportAssignments.length : 0;
					var sectionGroupsLength = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;

					// Look at each sectionGroup, and find each assignment that matches it
					for (var i = 0; i < sectionGroupsLength; i++) {
						var sectionGroupData = action.payload.sectionGroups[i];

						for (var j = 0; j < supportAssignmentsLength; j++) {
							var supportAssignmentData = action.payload.instructionalSupportAssignments[j];
							if (supportAssignmentData.sectionGroupId === sectionGroupData.id) {

								instructionalSupportAssignment = {};
								instructionalSupportAssignment.sectionGroupId = supportAssignmentData.sectionGroupId;
								instructionalSupportAssignment.courseId = sectionGroupData.courseId;

								instructionalSupportAssignment.type = supportAssignmentData.appointmentType;

								if (instructionalSupportAssignment.type == "reader" 
								&& isUniqueSectionGroup(potentialPreferences.readers, instructionalSupportAssignment.sectionGroupId)
								&& preferenceNotAlreadySet(instructionalSupportAssignment.sectionGroupId, "reader", action.payload.studentSupportPreferences)) {
									potentialPreferences.readers.push(instructionalSupportAssignment);
	
								} else if (instructionalSupportAssignment.type == "teachingAssistant"
								&& isUniqueSectionGroup(potentialPreferences.teachingAssistants, instructionalSupportAssignment.sectionGroupId)
								&& preferenceNotAlreadySet(instructionalSupportAssignment.sectionGroupId, "teachingAssistant", action.payload.studentInstructionalSupportPreferences)) {
									potentialPreferences.teachingAssistants.push(instructionalSupportAssignment);
	
								} else if (instructionalSupportAssignment.type == "associateInstructor"
								&& isUniqueSectionGroup(potentialPreferences.associateInstructors, instructionalSupportAssignment.sectionGroupId)
								&& preferenceNotAlreadySet(instructionalSupportAssignment.sectionGroupId, "associateInstructor", action.payload.studentInstructionalSupportPreferences)) {
									potentialPreferences.associateInstructors.push(instructionalSupportAssignment);
								}
							}
						}
					}

					// Find course associated with potentialPreferences to extract metadata
					for (var i = 0; i < potentialPreferences.readers.length; i++) {
						var slotPreference = potentialPreferences.readers[i];
						slotPreference = addCourseDataToPreference(action.payload.courses, slotPreference);
					}

					for (var i = 0; i < potentialPreferences.associateInstructors.length; i++) {
						var slotPreference = potentialPreferences.associateInstructors[i];
						slotPreference = addCourseDataToPreference(action.payload.courses, slotPreference);
					}

					for (var i = 0; i < potentialPreferences.teachingAssistants.length; i++) {
						var slotPreference = potentialPreferences.teachingAssistants[i];
						slotPreference = addCourseDataToPreference(action.payload.courses, slotPreference);
					}

					return potentialPreferences;

				case ADD_STUDENT_PREFERENCE:
					var preference = action.payload;

					if (preference.type == "reader") {
						for (var i = 0; i < potentialPreferences.readers.length; i ++) {
							var slotPotentialPreference = potentialPreferences.readers[i];

							if (slotPotentialPreference.sectionGroupId == preference.sectionGroupId) {
								potentialPreferences.readers.splice(i, 1);
								break;
							}
						}
					}

					if (preference.type == "teachingAssistant") {
						for (var i = 0; i < potentialPreferences.teachingAssistants.length; i ++) {
							var slotPotentialPreference = potentialPreferences.teachingAssistants[i];

							if (slotPotentialPreference.sectionGroupId == preference.sectionGroupId) {
								potentialPreferences.teachingAssistants.splice(i, 1);
								break;
							}
						}
					}

					if (preference.type == "associateInstructor") {
						for (var i = 0; i < potentialPreferences.associateInstructors.length; i ++) {
							var slotPotentialPreference = potentialPreferences.associateInstructors[i];

							if (slotPotentialPreference.sectionGroupId == preference.sectionGroupId) {
								potentialPreferences.associateInstructors.splice(i, 1);
								break;
							}
						}
					}

					return potentialPreferences;
				case DELETE_STUDENT_PREFERENCE:
					var preference = action.payload;

					if (preference.type == "teachingAssistant") {
						potentialPreferences.teachingAssistants.push(preference);
					} else if (preference.type == "associateInstructor") {
						potentialPreferences.associateInstructors.push(preference);
					} else if (preference.type == "reader") {
						potentialPreferences.readers.push(preference);
					}

					return potentialPreferences;
				default:
					return potentialPreferences;
			}
		},
		_preferenceReducers: function (action, preferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					preferences = [];

					var coursesLength = action.payload.courses ? action.payload.courses.length : 0;
					var sectionGroupsLength = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					var preferencesLength = action.payload.studentInstructionalSupportPreferences ? action.payload.studentInstructionalSupportPreferences.length: 0;

					for (var h = 0; h <  preferencesLength; h++) {
						var preferenceData = action.payload.studentInstructionalSupportPreferences[h];

						for (var i = 0; i < sectionGroupsLength; i++) {
							var sectionGroupData = action.payload.sectionGroups[i];

							if (preferenceData.sectionGroupId == sectionGroupData.id) {
								for (var j = 0; j < coursesLength; j++) {
									var courseData = action.payload.courses[j];
									if (sectionGroupData.courseId === courseData.id) {
										preferenceData.courseNumber = courseData.courseNumber;
										preferenceData.subjectCode = courseData.subjectCode;
										preferenceData.sequencePattern = courseData.sequencePattern;
										preferenceData.title = courseData.title;

										preferences.push(preferenceData);
									}
								}
							}
						}
					}

					return preferences;

				case ADD_STUDENT_PREFERENCE:
					var preference = action.payload;
					var sectionGroup = action.viewState.sectionGroups.list[preference.sectionGroupId];
					var course = action.viewState.courses.list[sectionGroup.courseId];

					preference.courseNumber = course.courseNumber;
					preference.subjectCode = course.subjectCode;
					preference.sequencePattern = course.sequencePattern;
					preference.title = course.title;

					preferences.push(preference);

					return preferences;
				case DELETE_STUDENT_PREFERENCE:
						var preferenceId = action.payload.id;

						for (var i = 0; i < preferences.length; i++) {
							var slotPreference = preferences[i];
							if (slotPreference.id == preferenceId) {
								preferences.splice(i, 1);
								return preferences;
							}
						}

						return preferences;
				default:
					return preferences;
			}
		},
		_instructionalSupportAssignmentsReducers: function (action, instructionalSupportAssignments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructionalSupportAssignments = {
						ids: []
					};

					var instructionalSupportAssignmentsList = {};

					var instructionalSupportAssignmentsLength = action.payload.instructionalSupportAssignments ? action.payload.instructionalSupportAssignments.length : 0;

					for (var i = 0; i < instructionalSupportAssignmentsLength; i++) {
						var instructionalSupportAssignmentData = action.payload.instructionalSupportAssignments[i];

						instructionalSupportAssignmentsList[instructionalSupportAssignmentData.id] = instructionalSupportAssignmentData;
						instructionalSupportAssignments.ids.push(instructionalSupportAssignmentData.id);
					}

					instructionalSupportAssignments.list = instructionalSupportAssignmentsList;

					return instructionalSupportAssignments;
				case DELETE_ASSIGNMENT:
					var index = instructionalSupportAssignments.ids.indexOf(action.payload.id);

					if (index > -1) {
						instructionalSupportAssignments.list[index] = null;
						instructionalSupportAssignments.ids.splice(index, 1);
					}

					return instructionalSupportAssignments;
					case ADD_ASSIGNMENT_SLOTS:
						instructionalSupportAssignmentsList = {};

						instructionalSupportAssignmentsLength = action.payload ? action.payload.length : 0;

						for (var i = 0; i < instructionalSupportAssignmentsLength; i++) {
							var instructionalSupportAssignmentData = action.payload[i];

							instructionalSupportAssignments.list[instructionalSupportAssignmentData.id] = instructionalSupportAssignmentData;
							instructionalSupportAssignments.ids.push(instructionalSupportAssignmentData.id);
						}

						return instructionalSupportAssignments;

				default:
					return instructionalSupportAssignments;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};
					return userInterface;
				case TOGGLE_ASSIGNMENT_PIVOT_VIEW:
					userInterface.displayCoursePivot = false;
					userInterface.displaySupportStaffPivot = false;

					switch(action.payload.viewName) {
						case "course":
							userInterface.displayCoursePivot = true;
							return userInterface;
						case "supportStaff":
						default:
							userInterface.displaySupportStaffPivot = true;
							return userInterface;
					}
				default:
					return userInterface;
			}
		},
		_supportCallResponseReducers: function (action, supportCallResponse) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportCallResponse = action.payload.studentSupportCallResponse;
					supportCallResponse.dueDateDescription = millisecondsToFullDate(supportCallResponse.dueDate);
					return supportCallResponse;
				case UPDATE_SUPPORT_CALL_RESPONSE:
					supportCallResponse = action.payload;
					return supportCallResponse;
				default:
					return supportCallResponse;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.instructionalSupportAssignments = scope._instructionalSupportAssignmentsReducers(action, scope._state.instructionalSupportAssignments);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			newState.potentialPreferences = scope._potentialPreferenceReducers(action, scope._state.potentialPreferences);
			newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
			newState.supportCallResponse = scope._supportCallResponseReducers(action, scope._state.supportCallResponse);

			scope._state = newState;

			$rootScope.$emit('instructionalSupportStudentFormStateChanged', {
				state: scope._state
			});

			$log.debug("Instructional Support state updated:");
			$log.debug(scope._state);
		}
	};
});

isUniqueSectionGroup = function(preferences, sectionGroupId) {
	for (var i = 0; i < preferences.length; i++) {
		var slotPreference = preferences[i];
		if (slotPreference.sectionGroupId == sectionGroupId) {
			return false;
		}
	}

	return true;
};

preferenceNotAlreadySet = function(sectionGroupId, type, preferences) {
	for (var i = 0; i < preferences.length; i++) {
		var slotPreference = preferences[i];

		if (slotPreference.type == type && slotPreference.sectionGroupId == sectionGroupId) {
			return false;
		}
	}
	
	return true;
};

addCourseDataToPreference = function(courses, preference) {
	for (var i = 0; i < courses.length; i++) {
		var slotCourse = courses[i];

		if (preference.courseId == slotCourse.id) {
			preference.courseNumber = slotCourse.courseNumber;
			preference.subjectCode = slotCourse.subjectCode;
			preference.sequencePattern = slotCourse.sequencePattern;
			preference.title = slotCourse.title;

			break;
		}
	}
};

millisecondsToFullDate = function(milliseconds) {
	var d = new Date(milliseconds);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	var formattedDate = year + "-" + month + "-" + day;
	formattedDate = moment(formattedDate, "YYYY-MM-DD").format('LL');

	return formattedDate;
};

// Sort the course Ids by subject Code and then course number
sortCourseIds = function(courseIds, courses) {

		courseIds.sort(function (aId, bId) {
			a = courses[aId];
			b = courses[bId];
			// Use subject codes to sort
			if (a.subjectCode > b.subjectCode) {
				return 1;
			}

			if (a.subjectCode < b.subjectCode) {
				return -1;
			}

			// Subject codes matched, use course numbers to sort
			if (a.courseNumber > b.courseNumber) {
				return 1;
			}

			if (a.courseNumber < b.courseNumber) {
				return -1;
			}

			// Course numbers matched, use sequencePattern to sort
			if (a.sequencePattern > b.sequencePattern) {
				return 1;
			}

			if (a.sequencePattern < b.sequencePattern) {
				return -1;
			}

			return -1;
		});

	return courseIds;
};