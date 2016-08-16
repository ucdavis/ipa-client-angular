'use strict';

/**
 * @ngdoc service
 schedulingApp.schedulingActionCreators
 * @description
 * # schedulingActionCreators
 schedulingApp.
 * Central location for sharedState information.
 */
schedulingApp.service('schedulingActionCreators', function (schedulingStateService, schedulingService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			schedulingService.getScheduleByWorkgroupIdAndYearAndTermCode(workgroupId, year, termCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		setSelectedSectionGroup: function (sectionGroup) {
			var action = {
				type: SECTION_GROUP_SELECTED,
				payload: {
					sectionGroup: sectionGroup
				}
			};
			schedulingStateService.reduce(action);
		},
		getSectionGroupDetails: function (sectionGroup) {
			schedulingService.getSectionSectionGroupDetails(sectionGroup.id).then(function (payload) {
				var action = {
					type: FETCH_SECTION_GROUP_DETAILS,
					payload: {
						sectionGroup: sectionGroup,
						sections: payload.sections,
						activities: payload.activities
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		}
	}
});
