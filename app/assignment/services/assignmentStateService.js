'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentStateService', function ($rootScope, SectionGroup, Course, ScheduleTermState) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
					courses = {
						ids: [],
						list: []
					};
					var coursesList = {};
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var course = new Course(action.payload.courses[i]);
						coursesList[course.id] = course;
						coursesList[course.id].isHidden = isCourseSuppressed(course);
						// Add the termCode:sectionGroupId pairs
						coursesList[course.id].sectionGroupTermCodeIds = {};

						action.payload.sectionGroups
							.filter(function (sectionGroup) {
								return sectionGroup.courseId === course.id
							})
							.forEach(function (sectionGroup) {
								coursesList[course.id].sectionGroupTermCodeIds[sectionGroup.termCode] = sectionGroup.id;
							});
					}
					courses.ids = _array_sortIdsByProperty(coursesList, ["subjectCode", "courseNumber", "sequencePattern"]);
					courses.list = coursesList;
					return courses;
				default:
					return courses;
			}
		},
		_scheduleTermStateReducers: function (action, scheduleTermStates) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
		_sectionGroupReducers: function (action, sectionGroups) {
			var scope = this;

			switch (action.type) {
				case INIT_ASSIGNMENT_VIEW:
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
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.scheduleTermStates = scope._scheduleTermStateReducers(action, scope._state.scheduleTermStates);
			newState.courses = scope._courseReducers(action, scope._state.courses);
			newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);

			scope._state = newState;

			$rootScope.$emit('assignmentStateChanged',scope._state);
		}
	}
});

// Returns false if course is a x98 or x99 series, unless the user has opted to show them
isCourseSuppressed = function(course) {
	// TODO: implement this check once toggle is added
	// if (suppressingDoNotPrint == false) { return false;}

	var lastChar = course.courseNumber.charAt(course.courseNumber.length-1);
	var secondLastChar = course.courseNumber.charAt(course.courseNumber.length-2);
	if (secondLastChar == 9 && (lastChar == 8 || lastChar == 9)) {
		return true;
	}
	return false;
}