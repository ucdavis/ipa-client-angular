instructionalSupportApp.service('studentReducers', function ($rootScope, $log, supportStaffFormSelectors) {
	return {
		_state: {},
		_sectionGroupReducers: function (action, sectionGroups) {
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
					var priority = preference.priority;
					preferences.ids.forEach(function(slotPreferenceId) {
						var slotPreference = preferences.list[slotPreferenceId];
						if (slotPreference.priority > priority) {
							slotPreference.priority--;
						}
					});
					return preferences;
				default:
					return preferences;
			}
		},
		_supportAssignmentReducers: function (action, supportAssignments) {
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
		_uiReducers: function (action, ui) {
			switch (action.type) {
				case INIT_STATE:
					ui = {
						isPreferenceCommentModalOpen: false
					};

				case OPEN_PREFERENCE_COMMENT_MODAL:
					ui.isPreferenceCommentModalOpen = true;
					return ui;
				case CLOSE_PREFERENCE_COMMENT_MODAL:
					ui.isPreferenceCommentModalOpen = false;
					return ui;
				default:
					return ui;
			}
		},
		_supportCallResponseReducers: function (action, supportCallResponse) {
			switch (action.type) {
				case INIT_STATE:
					supportCallResponse = action.payload.studentSupportCallResponse;
					if (!supportCallResponse) {
						return null;
					}
					supportCallResponse.dueDateDescription = millisecondsToDate(supportCallResponse.dueDate);
					return supportCallResponse;
				case UPDATE_SUPPORT_CALL_RESPONSE:
					supportCallResponse = action.payload;
					supportCallResponse.dueDateDescription = millisecondsToDate(supportCallResponse.dueDate);
					return supportCallResponse;
				default:
					return supportCallResponse;
			}
		},
		reduce: function (action) {
			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.supportAssignments = scope._supportAssignmentReducers(action, scope._state.supportAssignments);
			newState.misc = scope._miscReducers(action, scope._state.misc);
			newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
			newState.supportCallResponse = scope._supportCallResponseReducers(action, scope._state.supportCallResponse);
			newState.ui = scope._uiReducers(action, scope._state.ui);

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

			$rootScope.$emit('studentStateChanged', newPageState);
		}
	};
});