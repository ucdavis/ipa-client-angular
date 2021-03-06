import { _object_search_properties } from 'shared/helpers/object';

class SupportReducer {
	constructor ($rootScope, $log, SupportSelectors, ActionTypes) {
		return {
			_state: {},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sectionGroups = {
							ids: [],
							list: {}
						};
	
						action.payload.sectionGroups.forEach(function(sectionGroup) {
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
						});
	
						return sectionGroups;
					case ActionTypes.UPDATE_SECTIONGROUP: {
						let sectionGroup = action.payload.sectionGroup;
						sectionGroups.list[sectionGroup.id].readerAppointments = sectionGroup.readerAppointments;
						sectionGroups.list[sectionGroup.id].teachingAssistantAppointments = sectionGroup.teachingAssistantAppointments;

						return sectionGroups;
					}
					case ActionTypes.UPDATE_TABLE_FILTER:
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
					case ActionTypes.CALCULATE_SECTION_GROUP_SCHEDULING:
						sectionGroups.ids.forEach(function(sectionGroupId) {
							var sectionGroup = sectionGroups.list[sectionGroupId];
							sectionGroup.scheduledBlob = action.payload.sectionGroupBlobs[sectionGroupId];
						});
						return sectionGroups;
					case ActionTypes.CALCULATE_SCHEDULE_CONFLICTS:
						sectionGroups.ids.forEach(function(sectionGroupId) {
							var sectionGroup = sectionGroups.list[sectionGroupId];
							sectionGroup.supportStaffConflicts = action.payload.conflicts.bySectionGroupId[sectionGroupId] || [];
						}); 
						return sectionGroups;
					case ActionTypes.UPDATE_COURSE_TABLE_FILTER:
						var activeFilter = action.payload;

						if (activeFilter) {
							sectionGroups.ids.forEach(function(sectionGroupId) {
								var sectionGroup = sectionGroups.list[sectionGroupId];

								if (sectionGroup.supportAssignments.length > 0 || sectionGroup.teachingAssistantAppointments || sectionGroup.readerAppointments) {
									sectionGroup.isFiltered = false;
								} else {
									sectionGroup.isFiltered = true;
								}
							});
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
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sections = {
							ids: [],
							list: {},
							bySectionGroupId: {}
						};
	
						action.payload.sections.forEach(function(section) {
							sections.ids.push(section.id);
							sections.list[section.id] = section;
	
							sections.bySectionGroupId[section.sectionGroupId] = sections.bySectionGroupId[section.sectionGroupId] || [];
							sections.bySectionGroupId[section.sectionGroupId].push(section.id);
						});
	
						return sections;
					case ActionTypes.CALCULATE_SCHEDULE_CONFLICTS:
						sections.ids.forEach(function(sectionId) {
							var section = sections.list[sectionId];
							section.supportStaffConflicts = action.payload.conflicts.bySectionId[sectionId] || [];
						}); 
						return sections;
					case ActionTypes.CALCULATE_SECTION_SCHEDULING:
						sections.ids.forEach(function(sectionId) {
							var section = sections.list[sectionId];
							section.scheduledBlob = action.payload.sectionBlobs[sectionId];
						});
						return sections;
					default:
						return sections;
				}
			},
			_activityReducers: function (action, activities) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						activities = {
							ids: [],
							list: {},
							bySectionIds: {},
							bySectionGroupIds: {}
						};
	
						action.payload.activities.forEach(function(activity) {
							activities.ids.push(activity.id);
							activities.list[activity.id] = activity;
	
							if (activity.sectionId > 0) {
								activities.bySectionIds[activity.sectionId] = activities.bySectionIds[activity.sectionId] || [];
								activities.bySectionIds[activity.sectionId].push(activity.id);
							} else if (activity.sectionGroupId > 0) {
								activities.bySectionGroupIds[activity.sectionGroupId] = activities.bySectionGroupIds[activity.sectionGroupId] || [];
								activities.bySectionGroupIds[activity.sectionGroupId].push(activity.id);
							}
						});
	
						return activities;
					default:
						return activities;
				}
			},
			_supportAppointmentReducers: function (action, supportAppointments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportAppointments = {
							ids: [],
							list: {}
						};
	
						action.payload.supportAppointments.forEach(function(supportAppointment) {
							supportAppointments.ids.push(supportAppointment.id);
							supportAppointments.list[supportAppointment.id] = supportAppointment;
						});
						return supportAppointments;
					case ActionTypes.UPDATE_SUPPORT_APPOINTMENT:
						var supportAppointment = action.payload.supportAppointment;
						supportAppointment.percentage = parseFloat(supportAppointment.percentage);
	
						if (supportAppointments.ids.indexOf(supportAppointment.id) == -1) {
							supportAppointments.ids.push(supportAppointment.id);
						}
						supportAppointments.list[supportAppointment.id] = supportAppointment;
						return supportAppointments;
					default:
						return supportAppointments;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						courses = {
							ids: [],
							list: {}
						};
	
						action.payload.courses.forEach(function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
						});
	
						return courses;
					default:
						return courses;
				}
			},
			_supportAssignmentsReducers: function (action, supportAssignments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportAssignments = {
							ids: [],
							list: {},
							bySectionGroupIds: {},
							bySectionIds: {}
						};
	
						action.payload.supportAssignments.forEach(function(supportAssignment) {
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
					case ActionTypes.ASSIGN_STAFF_TO_SECTION_GROUP:
						var supportAssignment = action.payload.supportAssignment;
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;
						supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] = supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId] || [];
						supportAssignments.bySectionGroupIds[supportAssignment.sectionGroupId].push(supportAssignment.id);
						return supportAssignments;
					case ActionTypes.ASSIGN_STAFF_TO_SECTION:
						var supportAssignment = action.payload.supportAssignment;
						supportAssignments.ids.push(supportAssignment.id);
						supportAssignments.list[supportAssignment.id] = supportAssignment;
						supportAssignments.bySectionIds[supportAssignment.sectionId] = supportAssignments.bySectionIds[supportAssignment.sectionId] || [];
						supportAssignments.bySectionIds[supportAssignment.sectionId].push(supportAssignment.id);
						return supportAssignments;
					case ActionTypes.DELETE_ASSIGNMENT:
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
			_supportStaffListReducers: function (action, supportStaffList) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportStaffList = {
							ids: [],
							list: {}
						};
	
						// Support staff via roles
						action.payload.supportStaffList.forEach(function(supportStaff) {
							supportStaffList.list[supportStaff.id] = supportStaff;
							supportStaffList.ids.push(supportStaff.id);
						});
	
						// Support staff via assignments (but not necessarily roles)
						action.payload.assignedSupportStaff.forEach(function(supportStaff) {
							// Only add new supportStaff references
							if (supportStaffList.ids.indexOf(supportStaff.id) == -1) {
								supportStaffList.list[supportStaff.id] = supportStaff;
								supportStaffList.ids.push(supportStaff.id);
							}
						});
	
						return supportStaffList;
					case ActionTypes.CALCULATE_SCHEDULE_CONFLICTS:
						supportStaffList.ids.forEach(function(supportStaffId) {
							var supportStaff = supportStaffList.list[supportStaffId];
							supportStaff.sectionConflicts = action.payload.conflicts.bySupportStaffId[supportStaffId].sectionIds || [];
							supportStaff.sectionGroupConflicts = action.payload.conflicts.bySupportStaffId[supportStaffId].sectionGroupIds || [];
						}); 
						return supportStaffList;
					case ActionTypes.CALCULATE_STAFF_ASSIGNMENT_OPTIONS:
						supportStaffList.ids.forEach(function(supportStaffId) {
							var supportStaff = supportStaffList.list[supportStaffId];
							supportStaff.assignmentOptions = action.payload.staffAssignmentOptions[supportStaffId] || {};
						});
						return supportStaffList;
					case ActionTypes.UPDATE_TABLE_FILTER:
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
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportStaffPreferences = {
							ids: [],
							list: {}
						};
	
						action.payload.studentSupportPreferences.forEach(function(preference) {
							supportStaffPreferences.list[preference.id] = preference;
							supportStaffPreferences.ids.push(preference.id);
						});
						return supportStaffPreferences;
					default:
						return supportStaffPreferences;
				}
			},
			_instructorPreferenceReducers: function (action, instructorPreferences) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorPreferences = {
							ids: [],
							list: {}
						};
	
						action.payload.instructorSupportPreferences.forEach(function(preference) {
							instructorPreferences.list[preference.id] = preference;
							instructorPreferences.ids.push(preference.id);
						});
						return instructorPreferences;
					default:
						return instructorPreferences;
				}
			},
			_staffAssignmentOptionReducers: function(action, staffAssignmentOptions) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						staffAssignmentOptions = {};
						return staffAssignmentOptions;
					case ActionTypes.CALCULATE_STAFF_ASSIGNMENT_OPTIONS:
						return action.payload.staffAssignmentOptions;
					default:
						return staffAssignmentOptions;
				}
			},
			_supportStaffSupportCallResponseReducers: function (action, supportStaffSupportCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportStaffSupportCallResponses = {
							ids: [],
							list: {},
							bySupportStaffId: {}
						};
	
						action.payload.studentSupportCallResponses.forEach(function(supportCallResponse) {
							supportStaffSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
							supportStaffSupportCallResponses.ids.push(supportCallResponse.id);
							supportStaffSupportCallResponses.bySupportStaffId[supportCallResponse.supportStaffId] = supportCallResponse;
						});
						return supportStaffSupportCallResponses;
					default:
						return supportStaffSupportCallResponses;
				}
			},
			_instructorSupportCallResponseReducers: function (action, instructorSupportCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						instructorSupportCallResponses = {
							ids: [],
							list: {}
						};
	
						action.payload.instructorSupportCallResponses.forEach(function(supportCallResponse) {
							instructorSupportCallResponses.list[supportCallResponse.id] = supportCallResponse;
							instructorSupportCallResponses.ids.push(supportCallResponse.id);
						});
						return instructorSupportCallResponses;
					default:
						return instructorSupportCallResponses;
				}
			},
			_scheduleReducers: function (action, schedule) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						schedule = {};
						schedule = action.payload.schedule;
						return schedule;
					case ActionTypes.UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW:
						schedule = action.payload.schedule;
						return schedule;
					case ActionTypes.UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW:
						schedule = action.payload.schedule;
						return schedule;
					default:
						return schedule;
				}
			},
			_uiReducers: function (action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
	
						ui = {
							readOnlyMode: false,
							tabPivot: "By Course",
							viewType: "Teaching Assistants",
							supportStaffTabs: {},
							availabilityModal: {
								isOpen: false,
								data: null
							},
							shortTermCode: action.shortTermCode,
							termCode: parseInt(action.shortTermCode) > 4 ? action.year + action.shortTermCode : (parseInt(action.year) + 1) + action.shortTermCode,
							review: {
								instructor: {
									isOpen: (action.payload.schedule.instructorSupportCallReviewOpen[parseInt(action.shortTermCode) - 1] == "1"),
									data: action.payload.schedule.instructorSupportCallReviewOpen
								},
								supportStaff: {
									isOpen: (action.payload.schedule.supportStaffSupportCallReviewOpen[parseInt(action.shortTermCode) - 1] == "1"),
									data: action.payload.schedule.supportStaffSupportCallReviewOpen
								}
							},
							filters: {
								hideCoursesWithoutTa: false
							}
						};
	
						action.payload.supportStaffList.forEach(function(supportStaff) {
							ui.supportStaffTabs[supportStaff.id] = "Assignments";
						});
						action.payload.assignedSupportStaff.forEach(function(supportStaff) {
							ui.supportStaffTabs[supportStaff.id] = "Assignments";
						});
	
						return ui;
					case ActionTypes.SET_READ_ONLY_MODE:
						ui.readOnlyMode = true;
						return ui;
					case ActionTypes.OPEN_AVAILABILITY_MODAL:
						ui.availabilityModal.isOpen = true;
						ui.availabilityModal.data = action.payload.supportStaff;
						return ui;
					case ActionTypes.CLOSE_AVAILABILITY_MODAL:
						ui.availabilityModal.isOpen = false;
						ui.availabilityModal.data = null;
						return ui;
					case ActionTypes.SET_SUPPORT_STAFF_TAB:
						ui.supportStaffTabs[action.payload.supportStaffId] = action.payload.tabName;
						return ui;
					case ActionTypes.SET_VIEW_PIVOT:
						ui.tabPivot = action.payload.tabName;
						return ui;
					case ActionTypes.SET_VIEW_TYPE:
						ui.viewType = action.payload.viewType;
						return ui;
					case ActionTypes.UPDATE_INSTRUCTOR_SUPPORT_CALL_REVIEW:
					case ActionTypes.UPDATE_SUPPORT_STAFF_SUPPORT_CALL_REVIEW:
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
					case ActionTypes.TOGGLE_TA_FILTER:
						ui.filters.hideCoursesWithoutTa = action.payload;
						return ui;
					default:
						return ui;
				}
			},
	
			reduce: function (action) {
				var scope = this;
	
				let newState = {};
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
				newState.sections = scope._sectionReducers(action, scope._state.sections);
				newState.activities = scope._activityReducers(action, scope._state.activities);
				newState.staffAssignmentOptions = scope._staffAssignmentOptionReducers(action, scope._state.staffAssignmentOptions);
	
				scope._state = newState;
	
				// Build new 'page state'
				// This is the 'view friendly' version of the store
				let newPageState = {};
				newPageState.schedule = JSON.parse(JSON.stringify(scope._state.schedule));
        newPageState.ui = JSON.parse(JSON.stringify(scope._state.ui));
        newPageState.staffAssignmentOptions = JSON.parse(JSON.stringify(scope._state.staffAssignmentOptions));
				newPageState.supportAssignmentsUnique = SupportSelectors.generateSupportAssignmentsUnique(scope._state.supportAssignments, scope._state.sectionGroups, scope._state.courses);
				newPageState.supportAssignments = SupportSelectors.generateSupportAssignments(
																																				scope._state.supportAssignments,
																																				scope._state.sectionGroups,
																																				scope._state.courses);
				newPageState.supportStaffList = SupportSelectors.generateSupportStaffList(
																																				scope._state.supportAssignments,
																																				scope._state.courses,
																																				scope._state.sectionGroups,
																																				scope._state.sections,
																																				scope._state.supportStaffList,
																																				scope._state.supportStaffSupportCallResponses,
																																				scope._state.supportStaffPreferences,
																																				scope._state.supportAppointments,
																																				scope._state.ui);
				newPageState.sectionGroups = SupportSelectors.generateSectionGroups(
																																				scope._state.supportAssignments,
																																				scope._state.courses,
																																				scope._state.sectionGroups,
																																				scope._state.supportStaffList,
																																				scope._state.supportStaffSupportCallResponses,
																																				scope._state.supportStaffPreferences,
																																				scope._state.instructorPreferences,
																																				scope._state.instructorSupportCallResponses,
																																				scope._state.sections);
	
				$rootScope.$emit('supportAssignmentStateChanged', newPageState);
			}
		};
	}

	// Sort the course Ids by subject Code and then course number
	sortCourseIds (courseIds, courses) {
		courseIds.sort(function (aId, bId) {
			var a = courses[aId];
			var b = courses[bId];

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
	}
}

SupportReducer.$inject = ['$rootScope', '$log', 'SupportSelectors', 'ActionTypes'];

export default SupportReducer;
