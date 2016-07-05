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
					var length = action.payload.courses ? action.payload.courses.length : 0;
					for (var i = 0; i < length; i++) {
						var courseData = action.payload.tags[i];
						
						coursesList[courseData.id] = new Tag(courseData);
					}

					courses.ids = _array_sortIdsByProperty(coursesList, "title");
					courses.list = coursesList;
					return tags;
				default:
					return tags;
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
			console.log(scope._state);
		}
	}
});