'use strict';

/**
 * @ngdoc service
 * @name courseApp.courseActionCreators
 * @description
 * # courseActionCreators
 * Service in the courseApp.
 * Central location for sharedState information.
 */
courseApp.service('courseActionCreators', function (courseStateService, courseService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year) {
			courseService.getScheduleByWorkgroupIdAndYear(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});