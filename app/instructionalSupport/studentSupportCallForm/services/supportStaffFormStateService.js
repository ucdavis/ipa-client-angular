instructionalSupportApp.service('supportStaffFormStateService', function ($rootScope, $log, supportStaffFormSelectors) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sectionGroups = {
						ids: [],
						list: {}
					};

					action.payload.sectionGroups.forEach( function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

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

					action.payload.courses.forEach( function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					return courses;
				default:
					return courses;
			}
		},
		_preferenceReducers: function (action, preferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					preferences = {
						ids: [],
						list: []
					};

					action.payload.studentSupportPreferences.forEach( function(preference) {
						preferences.ids.push(preference.id);
						preferences.list[preference.id] = preference;
					});

					return preferences;
				case UPDATE_PREFERENCES_ORDER:
					action.payload;

					for (var i = 0; i < action.payload.length; i++) {
						var preferenceId = action.payload[i];
						var priority = i + 1;
						preferences.list[preferenceId].priority = priority;
					}

					return preferences;
				case ADD_STUDENT_PREFERENCE:
					var preference = action.payload;
					preferences.ids.push(preference.id);
					preferences.list[preference.id] = preference;

					return preferences;
				case DELETE_STUDENT_PREFERENCE:
					var preference = action.payload;
					var index = preferences.ids.indexOf(preference.id);
					preferences.ids.splice(index, 1);

					return preferences;
				default:
					return preferences;
			}
		},
		_supportAssignmentReducers: function (action, supportAssignments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportAssignments = {
						ids: [],
						list: []
					};

					action.payload.supportAssignments.forEach( function(supportAssignment) {
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;
					});

					return supportAssignments;
				default:
					return supportAssignments;
			}
		},
		_miscReducers: function (action, misc) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					misc = {};
					misc.scheduleId = action.payload.scheduleId;
					misc.supportStaffId = action.payload.supportStaffId;
					return misc;
				default:
					return misc;
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
					supportCallResponse.dueDateDescription = millisecondsToFullDate(supportCallResponse.dueDate);
					return supportCallResponse;
				default:
					return supportCallResponse;
			}
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.supportAssignments = scope._supportAssignmentReducers(action, scope._state.supportAssignments);
			newState.misc = scope._miscReducers(action, scope._state.misc);
			newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
			newState.supportCallResponse = scope._supportCallResponseReducers(action, scope._state.supportCallResponse);

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.supportCallResponse = angular.copy(scope._state.supportCallResponse);
			newPageState.misc = angular.copy(scope._state.misc);
			newPageState.supportAssignments = angular.copy(scope._state.supportAssignments);

			newPageState.preferences = supportStaffFormSelectors.generatePreferences(
																														scope._state.preferences,
																														scope._state.courses,
																														scope._state.sectionGroups
																													);

			newPageState.potentialPreferences = supportStaffFormSelectors.generatePotentialPreferences(
																																			scope._state.supportAssignments,
																																			scope._state.courses,
																																			scope._state.sectionGroups,
																																			scope._state.preferences,
																																			scope._state.supportCallResponse
																																		);

			$rootScope.$emit('supportStaffFormStateChanged', newPageState);
		}
	};
});

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