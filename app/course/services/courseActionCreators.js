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
		},
		setActiveCell: function (courseId, termCode) {
			var action = {
				type: SET_ACTIVE_CELL,
				payload: {
					courseId: courseId,
					termCode: termCode
				}
			};
			courseStateService.reduce(action);
		},
		saveOrCreateSectionGroup: function (courseId, termCode) {
			// TODO: Save or create here
		}
	}
});