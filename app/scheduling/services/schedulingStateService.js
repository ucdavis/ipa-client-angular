/**
 * @ngdoc service
 schedulingApp.schedulingStateService
 * @description
 * # schedulingStateService
 schedulingApp.
 * Central location for sharedState information.
 */
schedulingApp.service('schedulingStateService', function ($rootScope, $log, Course, SectionGroup, Section, Activity, Tag, Location, Instructor, TeachingCallResponse, Term, TeachingAssignment) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						newCourse: null,
						ids: []
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.courses[i];
						coursesList[courseData.id] = new Course(courseData);
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				case UPDATE_TAG_FILTERS:
					// Set the course.matchesTagFilters flag to true if any tag matches the filters
					courses.ids.forEach(function (courseId) {
						courses.list[courseId].matchesTagFilters = courses.list[courseId].tagIds
							.some(function (tagId) {
								return action.payload.tagIds.indexOf(tagId) >= 0;
							});
					});
					return courses;
				case FETCH_COURSE_ACTIVITY_TYPES:
					courses.list[action.payload.course.id].activityTypes = action.payload.activityTypes;
					return courses;
				default:
					return courses;
			}
		},
		_instructorReducers: function (action, instructors) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					instructors = {
						list: {},
						ids: []
					};
					var instructorsList = {};
					var length = action.payload.instructors ? action.payload.instructors.length : 0;
					for (var i = 0; i < length; i++) {
						var instructorData = action.payload.instructors[i];
						instructorsList[instructorData.id] = new Instructor(instructorData);
					}
					instructors.ids = _array_sortIdsByProperty(instructorsList, ["lastName", "firstName"]);
					instructors.list = instructorsList;
					return instructors;
				default:
					return instructors;
			}
		},
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
								return ta.sectionGroupId === sectionGroupData.id;
							})
							.map(function (ta) { return ta.instructorId; });

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
				case REMOVE_ACTIVITY:
					var sectionGroup = sectionGroups.list[action.payload.activity.sectionGroupId];
					if (!sectionGroup.sharedActivityIds) { return sectionGroups; }

					var activityIndex = sectionGroup.sharedActivityIds.indexOf(action.payload.activity.id);
					if (activityIndex >= 0) {
						sectionGroup.sharedActivityIds.splice(activityIndex, 1);
					}
					return sectionGroups;
				case CREATE_SHARED_ACTIVITY:
					sectionGroups.list[action.payload.sectionGroup.id].sharedActivityIds.push(action.payload.activity.id);
					return sectionGroups;
				case CREATE_SECTION:
					var section = action.payload.section;
					var sectionGroup = sectionGroups.list[section.sectionGroupId];
					sectionGroup.sectionIds.push(section.id);
					return sectionGroups;
				case GET_ACTIVITIES:
					var activities = action.payload.activities;
					var section = action.payload.section;
					var sectionGroup = sectionGroups.list[section.sectionGroupId];
					activities.forEach(function(activity) {
						if (activity.sectionGroupId == sectionGroup.id) {
							sectionGroup.sharedActivityIds.push(activity.id);
						}
					});
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
				case CREATE_SECTION:
					var section = action.payload.section;
					section.activityIds = [];
					sections.ids.push(section.id);
					sections.list[section.id] = section;
					return sections;
				case REMOVE_ACTIVITY:
					var section = sections.list[action.payload.activity.sectionId];
					if (section === undefined) { return sections; }

					var activityIndex = section.activityIds.indexOf(action.payload.activity.id);
					if (activityIndex >= 0) {
						section.activityIds.splice(activityIndex, 1);
					}
					return sections;
				case GET_ACTIVITIES:
					var activities = action.payload.activities;
					var sectionId = action.payload.section.id;
					var section = sections.list[sectionId];

					activities.forEach(function(activity) {
						if (activity.sectionId == sectionId) {
							section.activityIds.push(activity.id);
						}
					});
					return sections;
				case CREATE_ACTIVITY:
					sections.list[action.payload.activity.sectionId].activityIds.push(action.payload.activity.id);
					return sections;
				default:
					return sections;
			}
		},
		_teachingCallResponseReducers: function (action, teachingCallResponses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					activities = {
						list: {},
						ids: []
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
					return activities;
				case REMOVE_ACTIVITY:
					var activityIndex = activities.ids.indexOf(action.payload.activity.id);
					activities.ids.splice(activityIndex, 1);
					delete activities.list[action.payload.activity.id];
					return activities;
				case CREATE_SHARED_ACTIVITY:
				case CREATE_ACTIVITY:
					activities.list[action.payload.activity.id] = new Activity(action.payload.activity);
					activities.list[action.payload.activity.id].courseId = action.payload.sectionGroup.courseId;
					activities.ids.push(action.payload.activity.id);
					return activities;
				case GET_ACTIVITIES:
					var section = action.payload.section;
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
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
		_locationReducers: function (action, locations) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
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
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTagIds: [],
						enabledLocationIds: [],
						enabledInstructorIds: [],
						hiddenDays: [0, 6], // Default hidden days: Sat and Sun
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
					return filters;
				case TOGGLE_DAY:
					var tagIndex = filters.hiddenDays.indexOf(action.payload.dayIndex);
					if (tagIndex >= 0) {
						filters.hiddenDays.splice(tagIndex, 1);
					} else if (filters.hiddenDays.length < 6) { // Make sure not to hide all days
						filters.hiddenDays.push(action.payload.dayIndex);
					}
					return filters;
				case UPDATE_TAG_FILTERS:
					filters.enabledTagIds = action.payload.tagIds;
					return filters;
				case UPDATE_LOCATION_FILTERS:
					filters.enabledLocationIds = action.payload.locationIds;
					return filters;
				case UPDATE_INSTRUCTOR_FILTERS:
					filters.enabledInstructorIds = action.payload.instructorIds;
					return filters;
				default:
					return filters;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					uiState = {
						selectedSectionGroupId: null,
						selectedCourseId: null,
						selectedActivityId: null,
						checkedSectionGroupIds: [],
						allSectionGroupsDetailsCached: false,
						term: new Term(action.payload.term)
					};
					return uiState;
				case SECTION_GROUP_SELECTED:
					uiState.selectedActivityId = null;
					if (uiState.selectedSectionGroupId != action.payload.sectionGroup.id) {
						uiState.selectedSectionGroupId = action.payload.sectionGroup.id;
						uiState.selectedCourseId = action.payload.sectionGroup.courseId;
					} else {
						uiState.selectedSectionGroupId = null;
						uiState.selectedCourseId = null;
					}
					return uiState;
				case SECTION_GROUP_TOGGLED:
					var sectionGroupCheckedIndex = uiState.checkedSectionGroupIds.indexOf(action.payload.sectionGroupId);
					if (sectionGroupCheckedIndex < 0) {
						uiState.checkedSectionGroupIds.push(action.payload.sectionGroupId);
					} else {
						uiState.checkedSectionGroupIds.splice(sectionGroupCheckedIndex, 1);
					}
					return uiState;
				case CHECK_ALL_TOGGLED:
					if (uiState.checkedSectionGroupIds.length === 0) {
						uiState.checkedSectionGroupIds = action.payload.sectionGroupIds;
					} else {
						uiState.checkedSectionGroupIds = [];
					}
					return uiState;
				case ACTIVITY_SELECTED:
					if (action.payload.activity && uiState.selectedActivityId != action.payload.activity.id) {
						uiState.selectedActivityId = action.payload.activity.id;
						uiState.selectedSectionGroupId = action.payload.activity.sectionGroupId;
						uiState.selectedCourseId = action.payload.activity.courseId;
					} else {
						uiState.selectedActivityId = null;
					}
					return uiState;
				case UPDATE_TAG_FILTERS:
				case UPDATE_LOCATION_FILTERS:
				case UPDATE_INSTRUCTOR_FILTERS:
					// TODO: needs re-visiting, ultimately this should clear
					// checkedSectionGroupIds, selectedSectionGroupId, selectedCourseId,
					// and selectedActivityId ONLY if they don't match the filters
					uiState.selectedSectionGroupId = null;
					uiState.selectedCourseId = null;
					uiState.selectedActivityId = null;
					uiState.checkedSectionGroupIds = [];
					return uiState;
				case REMOVE_ACTIVITY:
					if (uiState.selectedActivityId == action.payload.activity.id) {
						uiState.selectedActivityId = null;
					}
					return uiState;
				default:
					return uiState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
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

			scope._state = newState;
			$rootScope.$emit('schedulingStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Scheduling state updated:");
			$log.debug(scope._state);
		}
	};
});
