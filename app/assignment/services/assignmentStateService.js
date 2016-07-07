'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupStateService
 * @description
 * # workgroupStateService
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentStateService', function ($rootScope, SectionGroup, Course) {
	return {
		_state: {},
		_courseReducers: function (action, courses) {
			var scope = this;

			switch (action.type) {
				case INIT_COURSES:
					courses = {
						ids: []
					};
					var coursesList = {};
					var length = action.payload ? action.payload.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload[i];
						
						coursesList[courseData.id] = new Course(courseData);
					}

					courses.ids = _array_sortIdsByProperty(coursesList, "title");
					courses.list = coursesList;
					return courses;
				default:
					return courses;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.courses = scope._courseReducers(action, scope._state.courses);

			scope._state = newState;
			$rootScope.$emit('assignmentStateChanged',scope._state);
		}
	}
});