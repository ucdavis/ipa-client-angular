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
			$rootScope.$emit('cellChanged', {
					courseId: courseId,
					termCode: termCode
			});
		},
		toggleTermFilter: function (termId) {
			var action = {
				type: TOGGLE_TERM_FILTER,
				payload: {
					termId: termId
				}
			};
			courseStateService.reduce(action);
		},
		addSectionGroup: function (sectionGroup) {
			courseService.addSectionGroup(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', {message: "Created course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS"});
				var action = {
					type: ADD_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		updateSectionGroup: function (sectionGroup) {
			courseService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
				$rootScope.$emit('toast', {message: "Updated course offering for " + sectionGroup.termCode.getTermCodeDisplayName(), type: "SUCCESS"});
				var action = {
					type: UPDATE_SECTION_GROUP,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				courseStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		}
	}
});