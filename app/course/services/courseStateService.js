'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseStateService
 * @description
 * # courseStateService
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseStateService', function ($rootScope, Course, ScheduleTermState, SectionGroup) {
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
		_viewReducers: function (action, view) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					view = {};
					return view;
				case SET_ACTIVE_CELL:
					view.selectedCourseId = action.payload.courseId;
					view.selectedTermCode = action.payload.termCode;
					return view;
				default:
					return view;
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
			newState.view = scope._viewReducers(action, scope._state.view);

			scope._state = newState;
			console.log(scope._state);
			$rootScope.$emit('courseStateChanged',scope._state);
		}
	}
});