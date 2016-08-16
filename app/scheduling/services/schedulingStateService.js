'use strict';

/**
 * @ngdoc service
 schedulingApp.schedulingStateService
 * @description
 * # schedulingStateService
 schedulingApp.
 * Central location for sharedState information.
 */
schedulingApp.service('schedulingStateService', function ($rootScope, Course, SectionGroup, Section, Activity, Tag) {
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
				default:
					return courses;
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
					}
					sectionGroups.list = sectionGroupsList;
					return sectionGroups;
				case FETCH_SECTION_GROUP_DETAILS:
					sectionGroups.list[action.payload.sectionGroup.id].sectionIds = action.payload.sections
						.sort(function (sectionA, sectionB) {
							if (sectionA.sequenceNumber < sectionB.sequenceNumber) { return -1; }
							if (sectionA.sequenceNumber > sectionB.sequenceNumber) { return 1; }
							return 0;
 						})
						.map(function (section) { return section.id; });
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
						list: {},
						ids: []
					};
					return sections;
				case FETCH_SECTION_GROUP_DETAILS:
					action.payload.sections.forEach(function (section) {
						section.activityIds = action.payload.activities
							.filter(function (a) { return a.sectionId == section.id; })
							.map(function (a) { return a.id; });
						sections.list[section.id] = new Section(section);
						sections.ids.push(section.id);
					});
					return sections;
				default:
					return sections;
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
					return activities;
				case FETCH_SECTION_GROUP_DETAILS:
					action.payload.activities.forEach(function (activity) {
						activities.list[activity.id] = new Activity(activity);
						activities.ids.push(activity.id);
					});
					return activities;
				default:
					return activities;
			}
		},
		_calendarActivityReducers: function (action, calendarActivities) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					calendarActivities = {
						list: {},
						ids: []
					};
					return calendarActivities;
				default:
					return calendarActivities;
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
						if (tagData.archived == false) {
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
		_filterReducers: function (action, filters) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					// A filter is 'enabled' if it is checked, i.e. the category it represents
					// is selected to be shown/on/active.
					filters = {
						enabledTags: [],
						enablePublishedCourses: true,
						enableUnpublishedCourses: false
					};
					// Here is where we might load stored data about what filters
					// were left on last time.
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
						checkedSectionGroupIds: []
					};
					return uiState;
				case SECTION_GROUP_SELECTED:
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
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.activities = scope._activityReducers(action, scope._state.activities);
			newState.calendarActivities = scope._calendarActivityReducers(action, scope._state.calendarActivities);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('schedulingStateChanged', {
				state: scope._state,
				actionType: action.type
			});

			console.debug("Scheduling state updated:");
			console.debug(scope._state);
		}
	}
});
