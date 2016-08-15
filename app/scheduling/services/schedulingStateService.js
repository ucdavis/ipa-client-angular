'use strict';

/**
 * @ngdoc service
 schedulingApp.schedulingStateService
 * @description
 * # schedulingStateService
 schedulingApp.
 * Central location for sharedState information.
 */
schedulingApp.service('schedulingStateService', function ($rootScope, Course, SectionGroup, Tag) {
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
				case NEW_COURSE:
					// Insert a new id of '0' at the specified index
					courses.ids.splice(action.payload.index, 0, 0);
					courses.newCourse = new Course();
					return courses;
				case CLOSE_NEW_COURSE_DETAILS:
					var newCourseIndex = courses.ids.indexOf(0);
					courses.ids.splice(newCourseIndex, 1);
					courses.newCourse = null;
					return courses;
				case CREATE_COURSE:
					// Close details
					var newCourseIndex = courses.ids.indexOf(0);
					courses.ids.splice(newCourseIndex, 1);
					courses.newCourse = null;
					// Insert new course
					courses.list[action.payload.course.id] = action.payload.course;
					courses.ids.splice(newCourseIndex, 0, action.payload.course.id);
					return courses;
				case REMOVE_COURSE:
					var courseIndex = courses.ids.indexOf(action.payload.course.id);
					courses.ids.splice(courseIndex, 1);
					delete courses.list[action.payload.course.id];
					return courses;
				case UPDATE_COURSE:
					courses.list[action.payload.course.id] = action.payload.course;
					return courses;
				case UPDATE_TABLE_FILTER:
					var query = action.payload.query.toLowerCase();

					courses.ids.forEach(function (courseId) {
						courses.list[courseId].isFiltered = true;
						for(key in courses.list[courseId]) {
							if (typeof courses.list[courseId][key] == "string"
								&& courses.list[courseId][key].toLowerCase().search(query) >= 0) {
								courses.list[courseId].isFiltered = false;
							}
						}

						return courses.list[courseId];
					});
					return courses;
				case GET_COURSE_CENSUS:
					courses.list[action.payload.course.id].census = action.payload.census;
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
				default:
					return sections;
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
						enabledTerms: [10, 1, 3], // these match the 'id' field in termDefinitions
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
						tableLocked: false,
						selectedCourseId: null,
						selectedTermCode: null,
						massImportMode: false
					};
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
