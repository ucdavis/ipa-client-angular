'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseStateService', function ($rootScope, Course, ScheduleTermState, SectionGroup, Tag) {
	return {
		_state: {},
		_scheduleTermStateReducers: function (action, scheduleTermStates) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					scheduleTermStates = {
						ids: []
					};
					var scheduleTermStateList = {};
					var length = action.payload.scheduleTermStates ? action.payload.scheduleTermStates.length : 0;
					for (var i = 0; i < length; i++) {
						var scheduleTermStateData = action.payload.scheduleTermStates[i];
						// Using termCode as key since the scheduleTermState does not have an id
						scheduleTermStateList[scheduleTermStateData.termCode] = new ScheduleTermState(scheduleTermStateData);
					}
					scheduleTermStates.ids = _array_sortIdsByProperty(scheduleTermStateList, "termCode");
					scheduleTermStates.list = scheduleTermStateList;
					return scheduleTermStates;
				default:
					return scheduleTermStates;
			}
		},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					courses = {
						newCourse: {},
						ids: []
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.courses[i];
						coursesList[courseData.id] = new Course(courseData);

						// Add the termCode:sectionGroupId pairs
						coursesList[courseData.id].sectionGroupTermCodeIds = {};
						action.payload.sectionGroups
							.filter(function (sg) {
								return sg.courseId === courseData.id
							})
							.forEach(function (sg) {
								coursesList[courseData.id].sectionGroupTermCodeIds[sg.termCode] = sg.id;
							});
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				case ADD_COURSE:
					courses.list[action.payload.course.id] = action.payload.course;
					courses.ids.push(action.payload.course.id);
					courses.newCourse = {};
					return courses;
				case REMOVE_COURSE:
					var courseIndex = courses.ids.indexOf(action.payload.course.id);
					courses.ids.splice(courseIndex, 1);
					delete courses.list[action.payload.course.id];
					return courses;
				case UPDATE_COURSE:
					courses.list[action.payload.course.id] = action.payload.course;
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
				case ADD_SECTION_GROUP:
					sectionGroups.list[action.payload.sectionGroup.id] = action.payload.sectionGroup;
					sectionGroups.ids.push(action.payload.sectionGroup.id);
					sectionGroups.newSectionGroup = {};
					return sectionGroups;
				case REMOVE_SECTION_GROUP:
					var sectionGroupIndex = sectionGroups.ids.indexOf(action.payload.sectionGroup.id);
					sectionGroups.ids.splice(sectionGroupIndex, 1);
					delete sectionGroups.list[action.payload.sectionGroup.id];
					return sectionGroups;
				case UPDATE_SECTION_GROUP:
					sectionGroups.list[action.payload.sectionGroup.id] = action.payload.sectionGroup;
					return sectionGroups;
				default:
					return sectionGroups;
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
				case TOGGLE_TERM_FILTER:
					var termId = action.payload.termId;
					var idx = filters.enabledTerms.indexOf(termId);
					// A term in the term filter dropdown has been toggled on or off.
					if(idx === -1) {
						// Toggle on
						filters.enabledTerms.push(termId);
					} else {
						// Toggle off
						filters.enabledTerms.splice(idx, 1);
					}
					return filters;
				default:
					return filters;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.scheduleTermStates = scope._scheduleTermStateReducers(action, scope._state.scheduleTermStates);
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
			newState.tags = scope._tagReducers(action, scope._state.tags);
			newState.filters = scope._filterReducers(action, scope._state.filters);

			scope._state = newState;
			$rootScope.$emit('courseStateChanged', scope._state);
			console.debug("Course state updated:");
			console.debug(scope._state);
		}
	}
});