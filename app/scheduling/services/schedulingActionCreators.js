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
		updateActivity: function (activity) {
			schedulingService.updateActivity(activity).then(function (updatedActivity) {
				$rootScope.$emit('toast', {message: "Updated " + activity.getCodeDescription(), type: "SUCCESS"});
				var action = {
					type: UPDATE_ACTIVITY,
					payload: {
						activity: updatedActivity
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		removeActivity: function (activity) {
			schedulingService.removeActivity(activity.id).then(function () {
				$rootScope.$emit('toast', {message: "Removed " + activity.getCodeDescription(), type: "SUCCESS"});
				var action = {
					type: REMOVE_ACTIVITY,
					payload: {
						activity: activity
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		createSharedActivity: function (activity, sectionGroup) {
			schedulingService.createSharedActivity(activity).then(function (newActivity) {
				$rootScope.$emit('toast', {message: "Created new shared " + activity.getCodeDescription(), type: "SUCCESS"});
				var action = {
					type: CREATE_SHARED_ACTIVITY,
					payload: {
						activity: newActivity,
						sectionGroup: sectionGroup
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', {message: "Something went wrong. Please try again.", type: "ERROR"});
			});
		},
		createActivity: function (activity, sectionGroup) {
			schedulingService.createActivity(activity).then(function (newActivity) {
				$rootScope.$emit('toast', {message: "Created new " + activity.getCodeDescription(), type: "SUCCESS"});
				var action = {
					type: CREATE_ACTIVITY,
					payload: {
						activity: newActivity,
						sectionGroup: sectionGroup
					}
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
		toggleCheckedSectionGroup: function (sectionGroupId) {
			var action = {
				type: SECTION_GROUP_TOGGLED,
				payload: {
					sectionGroupId: sectionGroupId
				}
			};
			schedulingStateService.reduce(action);
		},
		setSelectedActivity: function (activity) {
			var action = {
				type: ACTIVITY_SELECTED,
				payload: {
					activity: activity
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
						sharedActivities: payload.sharedActivities,
						unsharedActivities: payload.unsharedActivities,
						teachingCallResponses: payload.teachingCallResponses
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"} );
			});
		},
		toggleDay: function (dayIndex) {
			var action = {
				type: TOGGLE_DAY,
				payload: {
					dayIndex: dayIndex
				}
			};
			schedulingStateService.reduce(action);
		},
		updateTagFilters: function (tagIds) {
			var action = {
				type: UPDATE_TAG_FILTERS,
				payload: {
					tagIds: tagIds
				}
			};
			schedulingStateService.reduce(action);
		}
	}
});
