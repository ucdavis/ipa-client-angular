import { _array_sortIdsByProperty } from 'shared/helpers/array';
import { isNumber } from 'shared/helpers/types';

/**
 * @ngdoc service
 schedulingApp.schedulingStateService
 * @description
 * # schedulingStateService
 schedulingApp.
 * Central location for sharedState information.
 */
class SchedulingStateService {
	constructor ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term, TeachingAssignment, ActionTypes) {
		return {
			_state: {},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						courses = {
							newCourse: null,
							ids: [],
							list: {}
						};
						action.payload.courses.forEach(function(courseData) {
							courses.list[courseData.id] = new Course(courseData);
							if (courseData.tagIds.length > 0) {
								for (var i = 0; i < action.payload.tags.length; i++) {
									var slotTag = action.payload.tags[i];
									if (courseData.tagIds[0] == slotTag.id) {
										var tag = slotTag;
										break;
									}
								}
	
								if (tag) {
									courses.list[courseData.id].tagColor = tag.color;
								}
							}
						});
						courses.ids = _array_sortIdsByProperty(courses.list, ["subjectCode", "courseNumber", "sequencePattern"]);
						return courses;
					case ActionTypes.UPDATE_TAG_FILTERS:
						// Set the course.matchesTagFilters flag to true if any tag matches the filters
						courses.ids.forEach(function (courseId) {
							courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
								.some(function (tagId) {
									return action.payload.tagIds.indexOf(tagId) >= 0;
								});
						});
						return courses;
					case ActionTypes.FETCH_COURSE_ACTIVITY_TYPES:
						courses.list[action.payload.course.id].activityTypes = action.payload.activityTypes;
						return courses;
					default:
						return courses;
				}
			},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE: {
						instructors = {
							list: {},
							ids: []
						};

						let instructorAssignmentCounts = {};
						action.payload.teachingAssignments.forEach(function(assignment) {
							if (!assignment.sectionGroupId || assignment.approved == false) { return; }

							instructorAssignmentCounts[assignment.instructorId] = instructorAssignmentCounts[assignment.instructorId] || 0;
							instructorAssignmentCounts[assignment.instructorId] += 1;
						});

						var instructorsList = {};
						var length = action.payload.instructors ? action.payload.instructors.length : 0;
						for (var i = 0; i < length; i++) {
							var instructorData = action.payload.instructors[i];
							instructorData.assignmentCount = instructorAssignmentCounts[instructorData.id];
							instructorsList[instructorData.id] = new Instructor(instructorData);
						}
						instructors.ids = _array_sortIdsByProperty(instructorsList, ["lastName", "firstName"]);
						instructors.list = instructorsList;
						return instructors;
					}
					default:
						return instructors;
				}
			},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sectionGroups = {
							newSectionGroup: {},
							ids: []
						};
						var sectionGroupsList = {};
						var length = action.payload.sectionGroups ? action.payload.sectionGroups.length : 0;
						for (var i = 0; i < length; i++) {
							var sectionGroupData = action.payload.sectionGroups[i];
							sectionGroupsList[sectionGroupData.id] = new SectionGroup(sectionGroupData);
							sectionGroups.ids.push(sectionGroupData.id);
	
							// Set sectionGroup sectionIds
							sectionGroupsList[sectionGroupData.id].sectionIds = action.payload.sections
								.filter(function (section) {
									return section.sectionGroupId === sectionGroupData.id;
								})
								.sort(function (sectionA, sectionB) {
									if (sectionA.sequenceNumber < sectionB.sequenceNumber) { return -1; }
									if (sectionA.sequenceNumber > sectionB.sequenceNumber) { return 1; }
									return 0;
								})
								.map(function (section) { return section.id; });
	
							// Set sectionGroup sharedActivityIds
							sectionGroupsList[sectionGroupData.id].sharedActivityIds = action.payload.activities
								.filter(function (activity) {
									return activity.sectionGroupId === sectionGroupData.id && !(activity.sectionId);
								})
								.map(function (a) { return a.id; });
	
							// Set sectionGroup instructorIds
							sectionGroupsList[sectionGroupData.id].instructorIds = action.payload.teachingAssignments
								.filter(function (ta) {
									return ta.sectionGroupId === sectionGroupData.id && ta.instructorId != null;
								})
								.map(function (ta) { return ta.instructorId; });
	
								// Set sectionGroup instructorTypeIds
								sectionGroupsList[sectionGroupData.id].instructorTypeIds = action.payload.teachingAssignments
									.filter(function (ta) {
										return ta.sectionGroupId === sectionGroupData.id && ta.instructorId == null && ta.instructorTypeId != null;
									})
									.map(function (ta) { return ta.instructorTypeId; });
	
							// Set sectionGroup teachingCallResponseIds
							if (sectionGroupsList[sectionGroupData.id].instructorIds.length) {
								sectionGroupsList[sectionGroupData.id].teachingCallResponseIds = action.payload.teachingCallResponses
									.filter(function (tr) {
										return sectionGroupsList[sectionGroupData.id].instructorIds.indexOf(tr.instructorId) >= 0;
									})
									.map(function (tr) { return tr.id; });
							} else {
								sectionGroupsList[sectionGroupData.id].teachingCallResponseIds = [];
							}
	
							// Set sectionGroup locationIds
							sectionGroupsList[sectionGroupData.id].locationIds = action.payload.activities
								.filter(function (activity) {
									// Return activities that have locationId set and belong to sectionGroup in hand
									return activity.locationId && activity.sectionGroupId == sectionGroupData.id;
								}).map(function (activity) {
									return activity.locationId;
								});
						}
						sectionGroups.list = sectionGroupsList;
						return sectionGroups;
						case ActionTypes.REMOVE_ACTIVITY:
						var sectionGroup = sectionGroups.list[action.payload.activity.sectionGroupId];
						if (!sectionGroup.sharedActivityIds) { return sectionGroups; }
	
						var activityIndex = sectionGroup.sharedActivityIds.indexOf(action.payload.activity.id);
						if (activityIndex >= 0) {
							sectionGroup.sharedActivityIds.splice(activityIndex, 1);
						}
						return sectionGroups;
					case ActionTypes.CREATE_SHARED_ACTIVITY:
						sectionGroups.list[action.payload.sectionGroup.id].sharedActivityIds.push(action.payload.activity.id);
						return sectionGroups;
					case ActionTypes.CREATE_SECTION:
						var section = action.payload.section;
						var sectionGroup = sectionGroups.list[section.sectionGroupId];
						sectionGroup.sectionIds.push(section.id);
						return sectionGroups;
					case ActionTypes.DELETE_SECTION:
						var section = action.payload.section;
						var sectionGroup = sectionGroups.list[section.sectionGroupId];
	
						if (isNumber(action.payload.section.sequenceNumber)) {
							sectionGroup.sharedActivityIds = [];
						}
	
						var index = sectionGroup.sectionIds.indexOf(section.id);
						if (index > -1) {
							sectionGroup.sectionIds.splice(index, 1);
						}
						return sectionGroups;
					case ActionTypes.GET_ACTIVITIES:
						var activities = action.payload.activities;
						var section = action.payload.section;
						var sectionGroup = sectionGroups.list[section.sectionGroupId];
						activities.forEach(function(activity) {
							if (activity.sectionGroupId == sectionGroup.id && sectionGroup.sharedActivityIds.indexOf(activity.id) == -1) {
								sectionGroup.sharedActivityIds.push(activity.id);
							}
						});
						return sectionGroups;
					case ActionTypes.CREATE_SCHEDULING_NOTE:
						sectionGroups.list[action.payload.sectionGroupId].schedulingNotes = [
							...sectionGroups.list[action.payload.sectionGroupId].schedulingNotes,
							action.payload.schedulingNote,
						];
						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_sectionReducers: function (action, sections) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sections = {
							ids: []
						};
	
						var sectionsList = {};
						var length = action.payload.sections ? action.payload.sections.length : 0;
						for (var i = 0; i < length; i++) {
							var sectionData = action.payload.sections[i];
							sectionsList[sectionData.id] = new Section(sectionData);
							sections.ids.push(sectionData.id);
	
							sectionsList[sectionData.id].activityIds = action.payload.activities
								.filter(function (a) { return a.sectionId == sectionData.id; })
								.map(function (a) { return a.id; });
						}
	
						sections.list = sectionsList;
						return sections;
					case ActionTypes.CREATE_SECTION:
						var section = action.payload.section;
						section.activityIds = [];
						sections.ids.push(section.id);
						sections.list[section.id] = section;
						return sections;
					case ActionTypes.DELETE_SECTION:
						var section = action.payload.section;
						var index = sections.ids.indexOf(section.id);
						if (index > -1) {
							sections.ids.splice(section.id, 1);
						}
						sections.list[section.id] = null;
						return sections;
					case ActionTypes.REMOVE_ACTIVITY:
						var section = sections.list[action.payload.activity.sectionId];
						if (section === undefined) { return sections; }
	
						var activityIndex = section.activityIds.indexOf(action.payload.activity.id);
						if (activityIndex >= 0) {
							section.activityIds.splice(activityIndex, 1);
						}
						return sections;
					case ActionTypes.GET_ACTIVITIES:
						var activities = action.payload.activities;
						var sectionId = action.payload.section.id;
						var section = sections.list[sectionId];
	
						activities.forEach(function(activity) {
							if (activity.sectionId == sectionId) {
								section.activityIds.push(activity.id);
							}
						});
						return sections;
					case ActionTypes.CREATE_ACTIVITY:
						sections.list[action.payload.activity.sectionId].activityIds.push(action.payload.activity.id);
						return sections;
					default:
						return sections;
				}
			},
			_teachingCallResponseReducers: function (action, teachingCallResponses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						teachingCallResponses = {
							list: {},
							ids: []
						};
						var teachingCallResponsesList = {};
						var length = action.payload.teachingCallResponses ? action.payload.teachingCallResponses.length : 0;
						for (var i = 0; i < length; i++) {
							var teachingCallResponseData = action.payload.teachingCallResponses[i];
							teachingCallResponsesList[teachingCallResponseData.id] = new TeachingCallResponse(teachingCallResponseData);
							teachingCallResponses.ids.push(teachingCallResponseData.id);
						}
						teachingCallResponses.list = teachingCallResponsesList;
						return teachingCallResponses;
					default:
						return teachingCallResponses;
				}
			},
			_teachingAssignmentReducers: function (action, teachingAssignments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						teachingAssignments = {
							list: {},
							ids: []
						};
						var teachingAssignmentsList = {};
						var length = action.payload.teachingAssignments ? action.payload.teachingAssignments.length : 0;
						for (var i = 0; i < length; i++) {
							var teachingAssignmentData = action.payload.teachingAssignments[i];
							teachingAssignmentsList[teachingAssignmentData.id] = new TeachingAssignment(teachingAssignmentData);
							teachingAssignments.ids.push(teachingAssignmentData.id);
						}
						teachingAssignments.list = teachingAssignmentsList;
						return teachingAssignments;
					default:
						return teachingAssignments;
				}
			},
			_activityReducers: function (action, activities) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						activities = {
							list: {},
							ids: [],
							locationConflictActivityIds: []
						};
						var activitiesList = {};
						var length = action.payload.activities ? action.payload.activities.length : 0;
						for (var i = 0; i < length; i++) {
							var activityData = action.payload.activities[i];
							activitiesList[activityData.id] = new Activity(activityData);
							activitiesList[activityData.id].courseId = action.payload.sectionGroups
								.find(function (sg) { return sg.id === activityData.sectionGroupId; }).courseId;
							activities.ids.push(activityData.id);
						}
						activities.list = activitiesList;

						this._calculateLocationConflicts(activities);
						return activities;
					case ActionTypes.REMOVE_ACTIVITY:
						var activityIndex = activities.ids.indexOf(action.payload.activity.id);
						activities.ids.splice(activityIndex, 1);
						delete activities.list[action.payload.activity.id];
						return activities;
					case ActionTypes.UPDATE_ACTIVITY:
						activities.list[action.payload.activity.id] = new Activity(action.payload.activity);
						this._calculateLocationConflicts(activities);
						return activities;
					case ActionTypes.DELETE_SECTION:
						action.payload.section.activityIds.forEach(function(activityId) {
							var activityIndex = activities.ids.indexOf(activityId);
							activities.ids.splice(activityIndex, 1);
							delete activities.list[activityId];
						});
	
						// Delete shared activities if we are deleting a numeric section
						if (isNumber(action.payload.section.sequenceNumber)) {
							var activitiesToDelete = [];
	
							activities.ids.forEach(function(activityId) {
								var activity = activities.list[activityId];
								if (activity.sectionGroupId == action.payload.section.sectionGroupId) {
									delete activities.list[activityId];
									activitiesToDelete.push(activityId);
								}
							});
	
							activitiesToDelete.forEach(function(activityId) {
								var index = activities.ids.indexOf(activityId);
								activities.ids.splice(index, 1);
							});
						}
						return activities;
					case ActionTypes.CREATE_SHARED_ACTIVITY:
					case ActionTypes.CREATE_ACTIVITY:
						activities.list[action.payload.activity.id] = new Activity(action.payload.activity);
						activities.list[action.payload.activity.id].courseId = action.payload.sectionGroup.courseId;
						activities.ids.push(action.payload.activity.id);
						return activities;
					case ActionTypes.GET_ACTIVITIES:
						var activitiesPayload = action.payload.activities;
	
						activitiesPayload.forEach(function(activity) {
							activities.ids.push(activity.id);
							activities.list[activity.id] = new Activity(activity);
						});
						return activities;
					default:
						return activities;
				}
			},
			_tagReducers: function (action, tags) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						tags = {
							ids: []
						};
						var tagsList = {};
						var length = action.payload.tags ? action.payload.tags.length : 0;
						for (var i = 0; i < length; i++) {
							var tagData = action.payload.tags[i];
							if (tagData.archived === false) {
								tagsList[tagData.id] = new Tag(tagData);
							}
						}
						tags.ids = _array_sortIdsByProperty(tagsList, "name");
						tags.list = tagsList;
						return tags;
					default:
						return tags;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var instructorTypes = {
							ids: [],
							list: {}
						};
	
						action.payload.instructorTypes.forEach(function(instructorType) {
							instructorTypes.list[instructorType.id] = instructorType;
							instructorTypes.ids.push(instructorType.id);
						});
						return instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_locationReducers: function (action, locations) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						locations = {
							list: {},
							ids: []
						};
						var locationsList = {};
						var length = action.payload.locations ? action.payload.locations.length : 0;
						for (var i = 0; i < length; i++) {
							var locationData = action.payload.locations[i];
							if (locationData.archived === false) {
								locationsList[locationData.id] = new Location(locationData);
							}
						}
						locations.ids = _array_sortIdsByProperty(locationsList, "description");
						locations.list = locationsList;
						return locations;
					default:
						return locations;
				}
			},
			_filterReducers: function (action, filters) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						// A filter is 'enabled' if it is checked, i.e. the category it represents
						// is selected to be shown/on/active.
						filters = {
							enabledTagIds: [],
							enabledLocationIds: [],
							enabledInstructorIds: [],
							hiddenDays: [0, 6], // Default hidden days: Sat and Sun
							enableUnpublishedCourses: false,
							departmentalRoomDay: { number: 1, description: "Monday" },
							showOnlyPrimaryActivity: true
						};
						// Here is where we might load stored data about what filters
						// were left on last time.
						return filters;
					case ActionTypes.SET_DEPARTMENTAL_ROOMS_DAY:
						filters.departmentalRoomDay = action.payload.day;
						return filters;
					case ActionTypes.TOGGLE_DAY:
						var tagIndex = filters.hiddenDays.indexOf(action.payload.dayIndex);
						if (tagIndex >= 0) {
							filters.hiddenDays.splice(tagIndex, 1);
						} else if (filters.hiddenDays.length < 6) { // Make sure not to hide all days
							filters.hiddenDays.push(action.payload.dayIndex);
						}
						return filters;
					case ActionTypes.UPDATE_TAG_FILTERS:
						filters.enabledTagIds = action.payload.tagIds;
						return filters;
					case ActionTypes.UPDATE_LOCATION_FILTERS:
						filters.enabledLocationIds = action.payload.locationIds;
						return filters;
					case ActionTypes.UPDATE_INSTRUCTOR_FILTERS:
						filters.enabledInstructorIds = action.payload.instructorIds;
						return filters;
					case ActionTypes.TOGGLE_SHOW_ONLY_PRIMARY_ACTIVITY:
						filters.showOnlyPrimaryActivity = !filters.showOnlyPrimaryActivity;
						return filters;
					default:
						return filters;
				}
			},
			_uiStateReducers: function (action, uiState) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						var sectionGroupIds = action.payload.sectionGroups.map(sectionGroup => sectionGroup.id);

						uiState = {
							selectedSectionGroupId: null,
							selectedCourseId: null,
							selectedActivityId: null,
							checkedSectionGroupIds: sectionGroupIds,
							activeSectionGroupIds: sectionGroupIds,
							visibleSectionGroupIds: sectionGroupIds,
							allSectionGroupsDetailsCached: false,
							term: new Term(action.payload.term),
							calendarMode: {
								activeTab: "Weekly",
								allTabs: ["Weekly", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
								tabIcons: {"Weekly": "", "Sunday": "", "Monday": "", "Tuesday": "", "Wednesday": "", "Thursday": "", "Friday": "", "Saturday": ""}
							},
						};
						return uiState;
					case ActionTypes.SECTION_GROUP_SELECTED:
						uiState.selectedActivityId = null;
						if (uiState.selectedSectionGroupId != action.payload.sectionGroup.id) {
							uiState.selectedSectionGroupId = action.payload.sectionGroup.id;
							uiState.selectedCourseId = action.payload.sectionGroup.courseId;
						} else {
							uiState.selectedSectionGroupId = null;
							uiState.selectedCourseId = null;
						}
						return uiState;
					case ActionTypes.SELECT_CALENDAR_MODE:
						uiState.calendarMode.activeTab = action.payload.tab;
						return uiState;
					case ActionTypes.SECTION_GROUP_TOGGLED:
						var sectionGroupCheckedIndex = uiState.checkedSectionGroupIds.indexOf(action.payload.sectionGroupId);
						if (sectionGroupCheckedIndex < 0) {
							uiState.checkedSectionGroupIds.push(action.payload.sectionGroupId);
						} else {
							uiState.checkedSectionGroupIds.splice(sectionGroupCheckedIndex, 1);
						}
						return uiState;
					case ActionTypes.CHECK_ALL_TOGGLED:
						if (uiState.checkedSectionGroupIds.length === 0) {
							uiState.checkedSectionGroupIds = action.payload.sectionGroupIds;
						} else {
							uiState.checkedSectionGroupIds = [];
						}
						return uiState;
					case ActionTypes.ACTIVITY_TOGGLED:
						if (action.payload.activity && uiState.selectedActivityId != action.payload.activity.id) {
							uiState.selectedActivityId = action.payload.activity.id;
							uiState.selectedSectionGroupId = action.payload.activity.sectionGroupId;
							uiState.selectedCourseId = action.payload.activity.courseId;
						} else {
							uiState.selectedActivityId = null;
							uiState.selectedSectionGroupId = null;
							uiState.selectedCourseId = null;
						}
						return uiState;
					case ActionTypes.ACTIVITY_UNSELECTED:
						uiState.selectedActivityId = null;
						uiState.selectedSectionGroupId = null;
						uiState.selectedCourseId = null;
						return uiState;
					case ActionTypes.CALCULATE_SECTION_GROUPS:
						uiState.visibleSectionGroupIds = action.payload.visibleSectionGroupIds;
						uiState.activeSectionGroupIds = action.payload.activeSectionGroupIds;
						return uiState;
					case ActionTypes.APPLY_FILTER_TO_SELECTION:
						uiState.selectedCourseId = action.payload.selectedCourseId;
						uiState.selectedSectionGroupId = action.payload.selectedSectionGroupId;
						uiState.selectedActivityId = action.payload.selectedActivityId;
						return uiState;
					case ActionTypes.REMOVE_ACTIVITY:
						if (uiState.selectedActivityId == action.payload.activity.id) {
							uiState.selectedActivityId = null;
						}
						return uiState;
					default:
						return uiState;
				}
			},
			_calculateLocationConflicts: function (activities) {
				var locationConflictDays = [];
				var locationConflictActivityIds = [];
				var customLocationByDays = {
					0: [],
					1: [],
					2: [],
					3: [],
					4: [],
					5: [],
					6: [],
				};

				activities.ids.forEach(function (activityId) {
					if (activities.list[activityId].locationType === "custom") {
						var dayIndicator = activities.list[activityId].dayIndicator;
						var dayIndicatorArray = dayIndicator.split("");
						dayIndicatorArray.forEach(function (day, index) {
							if (parseInt(day)) {
								customLocationByDays[index].push(activities.list[activityId]);
							}
						});
					}
				});

				for (var day in customLocationByDays) {
					var customLocationActivities = customLocationByDays[day];

					for (var index = 0; index < customLocationActivities.length; index++) {
						var slotActivity = customLocationActivities[index];

						customLocationActivities.forEach(function (activity) {
							if (activity.id !== slotActivity.id && activity.locationId === slotActivity.locationId && activity.startTime < slotActivity.endTime && slotActivity.startTime < activity.endTime) {
								activities.list[slotActivity.id].locationConflict = true;
								locationConflictDays[day] = true;
								locationConflictActivityIds.push(slotActivity.id);
							}
						});
					}
				}

				activities.locationConflictDays = locationConflictDays;
				activities.locationConflictActivityIds = locationConflictActivityIds;
			},
			_generateCalendarTabIcons: function (locationConflictDays, tabIcons) {
				var tabIconClasses = "entypo-attention activity__event--location-conflict";
				tabIcons = { "Weekly": "", "Sunday": "", "Monday": "", "Tuesday": "", "Wednesday": "", "Thursday": "", "Friday": "", "Saturday": "" };

				locationConflictDays.forEach(function (_, index) {
					switch (index) {
						case 0:
							tabIcons["Sunday"] = tabIconClasses;
							break;
						case 1:
							tabIcons["Monday"] = tabIconClasses;
							break;
						case 2:
							tabIcons["Tuesday"] = tabIconClasses;
							break;
						case 3:
							tabIcons["Wednesday"] = tabIconClasses;
							break;
						case 4:
							tabIcons["Thursday"] = tabIconClasses;
							break;
						case 5:
							tabIcons["Friday"] = tabIconClasses;
							break;
						case 6:
							tabIcons["Saturday"] = tabIconClasses;
							break;
						default:
							break;
					}
				});

				return tabIcons;
			},
			reduce: function (action) {
				var scope = this;
	
				if (!action || !action.type) {
					return;
				}
	
				let newState = {};
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.sections = scope._sectionReducers(action, scope._state.sections);
				newState.teachingCallResponses = scope._teachingCallResponseReducers(action, scope._state.teachingCallResponses);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.activities = scope._activityReducers(action, scope._state.activities);
				newState.tags = scope._tagReducers(action, scope._state.tags);
				newState.locations = scope._locationReducers(action, scope._state.locations);
				newState.filters = scope._filterReducers(action, scope._state.filters);
				newState.uiState = scope._uiStateReducers(action, scope._state.uiState);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);

				newState.uiState.calendarMode.tabIcons = this._generateCalendarTabIcons(newState.activities.locationConflictDays, newState.uiState.calendarMode.tabIcons);

				scope._state = newState;
				$rootScope.$emit('schedulingStateChanged', {
					state: scope._state,
					action: action
				});

				$log.debug("Scheduling state updated:");
				$log.debug(scope._state);
			}
		};
	}
}

SchedulingStateService.$inject = ['$rootScope', '$log', 'Course', 'SectionGroup', 'Section', 'Activity', 'Tag', 'Location', 'Instructor', 'TeachingCallResponse', 'Term', 'TeachingAssignment', 'ActionTypes'];

export default SchedulingStateService;
