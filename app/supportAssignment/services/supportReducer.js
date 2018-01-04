supportAssignmentApp.service('supportReducer', function ($rootScope, $log, supportSelectors) {
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
				case UPDATE_SECTIONGROUP:
					sectionGroup = action.payload.sectionGroup;
					sectionGroups.list[sectionGroup.id].readerAppointments = sectionGroup.readerAppointments;
					sectionGroups.list[sectionGroup.id].teachingAssistantAppointments = sectionGroup.teachingAssistantAppointments;
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
		_sectionReducers: function (action, sections) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sections = {
						ids: [],
						list: {}
					};

					action.payload.sections.forEach( function(section) {
						sections.ids.push(section.id);
						sections.list[section.id] = section;
					});

					return sections;
				default:
					return sections;
			}
		},
		_supportAppointmentReducers: function (action, supportAppointments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportAppointments = {
						ids: [],
						list: {}
					};

					action.payload.supportAppointments.forEach( function(supportAppointment) {
						supportAppointments.ids.push(supportAppointment.id);
						supportAppointments.list[supportAppointment.id] = supportAppointment;
					});

					return supportAppointments;
				default:
					return supportAppointments;
			}
		},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						ids: [],
						list: {}
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
		_supportAssignmentsReducers: function (action, supportAssignments) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportAssignments = {
						ids: [],
						list: {},
						bySectionGroupIds: {},
						bySectionIds: {}
					};

					action.payload.supportAssignments.forEach( function(supportAssignment) {
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;

						if (supportAssignment.sectionGroupId) {
							supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] = supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] || [];
							supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId].push(supportAssignment.id);
						}

						if (supportAssignment.sectionId) {
							supportAssignments.bySectionIds[supportAssignment.sectionId] = supportAssignments.bySectionIds[supportAssignment.sectionId] || [];
							supportAssignments.bySectionIds[supportAssignment.sectionId].push(supportAssignment.id);
						}
					});

					return supportAssignments;
				case ASSIGN_STAFF_TO_SECTION_GROUP:
					var supportAssignment = action.payload.supportAssignment;
					supportAssignments.ids.push(supportAssignment.id);
					supportAssignments.list[supportAssignment.id] = supportAssignment;
					supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] = supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] || [];
					supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId].push(supportAssignment.id);
					return supportAssignments;
				case ASSIGN_STAFF_TO_SECTION:
					var supportAssignment = action.payload.supportAssignment;
					supportAssignments.ids.push(supportAssignment.id);
					supportAssignments.list[supportAssignment.id] = supportAssignment;
					supportAssignments.bySectionIds[supportAssignment.sectionId] = supportAssignments.bySectionIds[supportAssignment.sectionId] || [];
					supportAssignments.bySectionIds[supportAssignment.sectionId].push(supportAssignment.id);
					return supportAssignments;
				case DELETE_ASSIGNMENT:
					var index = supportAssignments.ids.indexOf(action.payload.id);
					var sectionId = action.payload.sectionId ? action.payload.sectionId : null;
					var sectionGroupId = action.payload.sectionGroupId ? action.payload.sectionGroupId : null;

					if (index > -1) {
						supportAssignments.ids.splice(index, 1);
						supportAssignments.list[index] = null;
					}

					if (sectionId) {
						var index = supportAssignments.bySectionIds[sectionId].indexOf(action.payload.id);
						supportAssignments.bySectionIds[sectionId].splice(index, 1);
					}

					if (sectionGroupId) {
						var index = supportAssignments.bySectionGroupIds[sectionGroupId].indexOf(action.payload.id);
						supportAssignments.bySectionGroupIds[sectionGroupId].splice(index, 1);
					}
					return supportAssignments;
				default:
					return supportAssignments;
			}
		},
		_assignedSupportStaffListReducers: function (action, assignedSupportStaffList) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					assignedSupportStaffList = {
						ids: [],
						list: {}
					};

					if (action.payload.assignedSupportStaff) {
						action.payload.assignedSupportStaff.forEach( function(supportStaff) {
							assignedSupportStaffList.list[supportStaff.id] = supportStaff;
							assignedSupportStaffList.ids.push(supportStaff.id);
						});
					}

					return assignedSupportStaffList;
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;

					// Apply search filters
					if (query.length > 0) {
						// Specify the properties that we are interested in searching
						var searchProperties = ['firstName', 'lastName', 'fullName'];

						_object_search_properties(query, assignedSupportStaffList, searchProperties);
					} else {
						assignedSupportStaffList.ids.forEach(function(supportStaffId) {
							assignedSupportStaffList.list[supportStaffId].isFiltered = false;
						});
					}
				default:
					return assignedSupportStaffList;
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
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query;

					// Apply search filters
					if (query.length > 0) {
						// Specify the properties that we are interested in searching
						var searchProperties = ['firstName', 'lastName', 'fullName'];

						_object_search_properties(query, supportStaffList, searchProperties);
					} else {
						supportStaffList.ids.forEach(function(supportStaffId) {
							supportStaffList.list[supportStaffId].isFiltered = false;
						});
					}
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
		_instructorPreferenceReducers: function (action, instructorPreferences) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructorPreferences = {
						ids: [],
						list: {}
					};

					action.payload.instructorSupportPreferences.forEach( function(preference) {
						instructorPreferences.list[preference.id] = preference;
						instructorPreferences.ids.push(preference.id);
					});
					return instructorPreferences;
				default:
					return instructorPreferences;
			}
		},
		_supportStaffSupportCallResponseReducers: function (action, supportStaffSupportCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					supportStaffSupportCallResponses = {
						ids: [],
						list: {}
					};

					action.payload.studentSupportCallResponses.forEach( function(supportCallResponse) {
						supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
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
						list: {}
					};

					action.payload.instructorSupportCallResponses.forEach( function(supportCallResponse) {
						instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
						instructorSupportCallResponses.ids.push(supportCallResponse.id);
					});
					return instructorSupportCallResponses;
				default:
					return instructorSupportCallResponses;
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
					schedule = action.payload.schedule;
					return schedule;
				case UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW:
					schedule = action.payload.schedule;
					return schedule;
				default:
					return schedule;
			}
		},
		_uiReducers: function (action, ui) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					ui = {
						tabPivot: "By Course",
						viewType: "Teaching Assistants",
						supportStaffTabs: {},
						availabilityModal: {
							isOpen: false,
							data: null
						},
						shortTermCode: action.shortTermCode,
						review: {
							instructor: {
								isOpen: (action.payload.schedule.instructorSupportCallReviewOpen[parseInt(action.shortTermCode) - 1] == "1"),
								data: action.payload.schedule.instructorSupportCallReviewOpen
							},
							supportStaff: {
								isOpen: (action.payload.schedule.supportStaffSupportCallReviewOpen[parseInt(action.shortTermCode) - 1] == "1"),
								data: action.payload.schedule.supportStaffSupportCallReviewOpen
							}
						}
					};

					action.payload.supportStaffList.forEach(function(supportStaff) {
						ui.supportStaffTabs[supportStaff.id] = "Assignments";
					});
					action.payload.assignedSupportStaff.forEach(function(supportStaff) {
						ui.supportStaffTabs[supportStaff.id] = "Assignments";
					});

					return ui;
				case OPEN_AVAILABILITY_MODAL:
					ui.availabilityModal.isOpen = true;
					ui.availabilityModal.data = action.payload.supportStaff;
					return ui;
				case CLOSE_AVAILABILITY_MODAL:
					ui.availabilityModal.isOpen = false;
					ui.availabilityModal.data = null;
					return ui;
				case SET_SUPPORT_STAFF_TAB:
					ui.supportStaffTabs[action.payload.supportStaffId] = action.payload.tabName;
					return ui;
				case SET_VIEW_PIVOT:
					ui.tabPivot = action.payload.tabName;
					return ui;
				case SET_VIEW_TYPE:
					ui.viewType = action.payload.viewType;
					return ui;
				case UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW:
				case UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW:
					ui.review = {
						instructor: {
							isOpen: (action.payload.schedule.instructorSupportCallReviewOpen[parseInt(action.payload.shortTermCode) - 1] == "1"),
							data: action.payload.schedule.instructorSupportCallReviewOpen
						},
						supportStaff: {
							isOpen: (action.payload.schedule.supportStaffSupportCallReviewOpen[parseInt(action.payload.shortTermCode) - 1] == "1"),
							data: action.payload.schedule.supportStaffSupportCallReviewOpen
						}
					};
					return ui;
				default:
					return ui;
			}
		},

		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.supportAssignments = scope._supportAssignmentsReducers(action, scope._state.supportAssignments);
			newState.supportAppointments = scope._supportAppointmentReducers(action, scope._state.supportAppointments);
			newState.supportStaffPreferences = scope._supportStaffPreferenceReducers(action, scope._state.supportStaffPreferences);
			newState.instructorPreferences = scope._instructorPreferenceReducers(action, scope._state.instructorPreferences);
			newState.supportStaffList = scope._supportStaffListReducers(action, scope._state.supportStaffList);
			newState.ui = scope._uiReducers(action, scope._state.ui);
			newState.schedule = scope._scheduleReducers(action, scope._state.schedule);
			newState.supportStaffSupportCallResponses = scope._supportStaffSupportCallResponseReducers(action, scope._state.supportStaffSupportCallResponses);
			newState.instructorSupportCallResponses = scope._instructorSupportCallResponseReducers(action, scope._state.instructorSupportCallResponses);
			newState.assignedSupportStaffList = scope._assignedSupportStaffListReducers(action, scope._state.assignedSupportStaffList);
			newState.sections = scope._sectionReducers(action, scope._state.sections);

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.schedule = angular.copy(scope._state.schedule);
			newPageState.ui = angular.copy(scope._state.ui);
			newPageState.supportAssignmentsUnique = supportSelectors.generateSupportAssignmentsUnique(
																																			scope._state.supportAssignments,
																																			scope._state.sectionGroups,
																																			scope._state.courses
																																		);

			newPageState.supportAssignments = supportSelectors.generateSupportAssignments(
																																			scope._state.supportAssignments,
																																			scope._state.sectionGroups,
																																			scope._state.courses
																																		);

			newPageState.supportStaffList = supportSelectors.generateSupportStaffList(
																																			scope._state.supportAssignments,
																																			scope._state.courses,
																																			scope._state.sectionGroups,
																																			scope._state.sections,
																																			scope._state.supportStaffList,
																																			scope._state.assignedSupportStaffList,
																																			scope._state.supportStaffSupportCallResponses,
																																			scope._state.supportStaffPreferences,
																																			scope._state.supportAppointments,
																																			scope._state.ui
																																		);

			newPageState.sectionGroups = supportSelectors.generateSectionGroups(
																																			scope._state.supportAssignments,
																																			scope._state.courses,
																																			scope._state.sectionGroups,
																																			scope._state.supportStaffList,
																																			scope._state.assignedSupportStaffList,
																																			scope._state.supportStaffSupportCallResponses,
																																			scope._state.supportStaffPreferences,
																																			scope._state.instructorPreferences,
																																			scope._state.instructorSupportCallResponses,
																																			scope._state.sections
																																		);

			$rootScope.$emit('supportAssignmentStateChanged', newPageState);
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