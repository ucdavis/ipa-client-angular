'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
assignmentApp.service('assignmentActionCreators', function (assignmentStateService, assignmentService, $rootScope, Role) {
	return {
		getInitCourses: function (workgroupId, year) {
			console.log("get initCourses");
			assignmentService.getCoursesByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_COURSES,
					payload: payload
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});