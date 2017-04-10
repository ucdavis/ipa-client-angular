instructionalSupportApp.service('instructionalSupportAssignmentStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term) {
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
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;

					// Apply search filters
					if (query.length > 0) {
						// Specify the properties that we are interested in searching
						var sectionGroupKeyList = ['courseNumber', 'sequencePattern', 'subjectCode', 'title'];

						_object_search_properties(query, sectionGroups, sectionGroupKeyList);
					} else {
						sectionGroups.ids.forEach(function(sectionGroupId) {
							sectionGroups.list[sectionGroupId].isFiltered = false;
						});
					}

					return sectionGroups;
				default:
					return sectionGroups;
			}
		},
		_supportAssignmentsReducers: function (action, supportAssignments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportAssignments = {
						ids: [],
						list: {}
					};

					action.payload.supportAssignments.forEach( function(assignment) {
						supportAssignments.ids.push(assignment.id);
						supportAssignments.list[assignment.id] = assignment;
					});

					return supportAssignments;
				case DELETE_ASSIGNMENT:
					var index = supportAssignments.ids.indexOf(action.payload.id);

					if (index > -1) {
						supportAssignments.ids.splice(index, 1);
						supportAssignments.list[index] = null;
					}

					return supportAssignments;
					case ADD_ASSIGNMENT_SLOTS:
						action.payload.forEach( function (supportAssignment) {
							supportAssignments.list[instructionalSupportAssignmentData.id] = instructionalSupportAssignmentData;
							supportAssignments.ids.push(instructionalSupportAssignmentData.id);
						});
						return supportAssignments;
					case REMOVE_STAFF_FROM_SLOT:
						var supportAssignment = action.payload;
						supportAssignments.list[supportAssignment.id] = supportAssignment;

						return supportAssignments;
					case ASSIGN_STAFF_TO_SLOT:
						var supportAssignment = action.payload;
						supportAssignments.list[supportAssignment.id] = supportAssignment;
						return supportAssignments;
				default:
					return supportAssignments;
			}
		},
		_supportStaffListReducers: function (action, supportStaffList) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaffList = {
						ids: [],
						list: {}
					};

					action.payload.supportStaffList.forEach( function(supportStaff) {
						supportStaffList.list[supportStaff.id] = supportStaff;
						supportStaffList.ids.push(supportStaff.id);
					});

					return supportStaffList;
				default:
					return supportStaffList;
			}
		},
		_supportStaffPreferenceReducers: function (action, supportStaffPreferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaffPreferences = {
						ids: [],
						list: {}
					};

					action.payload.studentSupportPreferences.forEach( function(preference) {
						supportStaffPreferences.list[preference.id] = preference;
						supportStaffPreferences.ids.push(preference.id);
					});
					return supportStaffPreferences;
				default:
					return supportStaffPreferences;
			}
		},
		_scheduleReducers: function (action, schedule) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					schedule = {};
					schedule = action.payload.schedule;
					return schedule;
				case UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW:
					schedule = action.payload;
					return schedule;
				case UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW:
					schedule = action.payload;
					return schedule;
				default:
					return schedule;
			}
		},
		_userInterfaceReducers: function (action, userInterface) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					userInterface = {};

					userInterface.displayCoursePivot = true;
					userInterface.displaySupportStaffPivot = false;

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

		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.instructionalSupportAssignments = scope._supportAssignmentsReducers(action, scope._state.instructionalSupportAssignments);
			newState.supportStaffPreferences = scope._supportStaffPreferenceReducers(action, scope._state.supportStaffPreferences);
			newState.supportStaffList = scope._supportStaffListReducers(action, scope._state.supportStaffList);
			newState.userInterface = scope._userInterfaceReducers(action, scope._state.userInterface);
			newState.schedule = scope._scheduleReducers(action, scope._state.schedule);

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.schedule = angular.copy(scope._state.schedule);
			newPageState.userInterface = angular.copy(scope._state.userInterface);

			newPageState.sectionGroups = supportStaffFormSelectors.generateSectionGroups(
																														scope._state.preferences,
																														scope._state.courses,
																														scope._state.sectionGroups
																													);

			newPageState.supportStaffList = supportStaffFormSelectors.generateSupportStaffList(
																																			scope._state.supportAssignments,
																																			scope._state.courses,
																																			scope._state.sectionGroups,
																																			scope._state.preferences,
																																			scope._state.supportCallResponse
																																		);

			$rootScope.$emit('supportAssignmentStateChanged', {
				state: scope._state
			});
		}
	};
});

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