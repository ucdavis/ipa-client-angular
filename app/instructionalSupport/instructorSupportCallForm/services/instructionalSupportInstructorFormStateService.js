instructionalSupportApp.service('instructionalSupportInstructorFormStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = [];

					var allSupportStaffIds = [];
					action.payload.supportStaffList.forEach( function(slotSupportStaff) {
						allSupportStaffIds.push(slotSupportStaff.id);
					});

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
								sectionGroup.instructorPreferences = [];

								// Build the preferences and other support staff arrays
								sectionGroup.eligibleSupportStaff = {};
								sectionGroup.eligibleSupportStaff.other = allSupportStaffIds;
								sectionGroup.eligibleSupportStaff.preferred = [];

								action.payload.studentSupportPreferences.forEach( function(slotPreference) {
									if (slotPreference.sectionGroupId == sectionGroup.id) {

										sectionGroup.eligibleSupportStaff.preferred.push(slotPreference);
										// Remove the 'student with a preference' from the 'other' category so they only show up once
										var index = sectionGroup.eligibleSupportStaff.other.indexOf(slotPreference.instructionalSupportStaffId);
										if (index > -1) {
											sectionGroup.eligibleSupportStaff.other.splice(index,1);
										}
									}
								});

								sectionGroups.push(sectionGroup);
							}
						}
					}

					// Add preferences to sectionGroups
					sectionGroups.forEach( function(sectionGroup) {
						action.payload.instructorSupportPreferences.forEach( function(instructorPreference) {
							if (instructorPreference.sectionGroupId == sectionGroup.id) {
								sectionGroup.instructorPreferences.push(instructorPreference);
							}
						});
					});

					return sectionGroups;
				case DELETE_INSTRUCTOR_PREFERENCE:
					var preference = action.payload.preference;
					var studentPreferences = action.payload.studentPreferences;
					var supportStaffId = null;


					for (var i = 0; i < sectionGroups.length; i++) {
						var sectionGroup = sectionGroups[i];

						if (preference.sectionGroupId == sectionGroup.id) {
							// Remove Preference from preferences list
							for (var j = 0; j < sectionGroup.instructorPreferences.length; j++) {
								var slotInstructorPreference = sectionGroup.instructorPreferences[j];
								if (slotInstructorPreference.id == preference.id) {
									supportStaffId = sectionGroup.instructionalSupportStaffId;
									sectionGroup.instructorPreferences.splice(j,1);

									// Did the student have a preference? Add them to preferred list
									for (var k = 0; k < studentPreferences.ids.length; k++) {
										var slotStudentPreference = studentPreferences.list[studentPreferences.ids[k]];

										// Student Preference found
										if (slotStudentPreference.instructionalSupportStaffId == supportStaffId) {
											sectionGroup.eligibleSupportStaff.preferred.push(slotStudentPreference);
											return sectionGroups;
										}
									}

									// Else add them back to other
									sectionGroup.eligibleSupportStaff.other.push(supportStaffId);

									return sectionGroups;
								}
							}
						}
					}

					return sectionGroups;
					case ADD_INSTRUCTOR_PREFERENCE:
						var newPreference = action.payload.newPreference;
						var studentPreferences = action.payload.studentPreferences;

						for (var i = 0; i < sectionGroups.length; i++) {
							var sectionGroup = sectionGroups[i];

							if (newPreference.sectionGroupId == sectionGroup.id) {
								sectionGroup.instructorPreferences.push(newPreference);
								return sectionGroups;
							}
						}

						return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_preferenceReducers: function (action, preferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					preferences = [];

					var coursesLength = action.payload.courses ? action.payload.courses.length : 0;
					var sectionGroupsLength = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
					var preferencesLength = action.payload.studentsupportPreferences ? action.payload.studentInstructionalSupportPreferences.length: 0;

					for (var h = 0; h <  preferencesLength; h++) {
						var preferenceData = action.payload.studentsupportPreferences[h];

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
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};
					return userInterface;
				default:
					return userInterface;
			}
		},
		_supportStaffReducers: function (action, supportStaff) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaff = {
						ids: [],
						list: {}
					};

					action.payload.supportStaffList.forEach( function(slotSupportStaff) {
						supportStaff.ids.push(slotSupportStaff.id);
						supportStaff.list[slotSupportStaff.id] = slotSupportStaff;
					});

					return supportStaff;
				default:
					return supportStaff;
			}
		},
		_studentPreferenceReducers: function (action, studentPreferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					studentPreferences = {
						ids: [],
						list: {}
					};

					action.payload.studentSupportPreferences.forEach( function(slotStudentPreference) {
						studentPreferences.ids.push(slotStudentPreference.id);
						studentPreferences.list[slotStudentPreference.id] = slotStudentPreference;
					});

					return studentPreferences;
				default:
					return studentPreferences;
			}
		},
		_supportCallResponseReducers: function (action, supportCallResponse) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportCallResponse = action.payload.instructorSupportCallResponse;
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
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.supportStaff = scope._supportStaffReducers(action, scope._state.supportStaff);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
			newState.supportCallResponse = scope._supportCallResponseReducers(action, scope._state.supportCallResponse);
			newState.studentPreferences = scope._studentPreferenceReducers(action, scope._state.studentPreferences)
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