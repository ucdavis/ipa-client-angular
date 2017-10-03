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
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateActivity: function (activity) {
			schedulingService.updateActivity(activity).then(function (updatedActivity) {
				$rootScope.$emit('toast', { message: "Updated " + activity.getCodeDescription(), type: "SUCCESS" });
				var action = {
					type: UPDATE_ACTIVITY,
					payload: {
						activity: updatedActivity
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeActivity: function (activity) {
			schedulingService.removeActivity(activity.id).then(function () {
				$rootScope.$emit('toast', { message: "Removed " + activity.getCodeDescription(), type: "SUCCESS" });
				var action = {
					type: REMOVE_ACTIVITY,
					payload: {
						activity: activity
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createSharedActivity: function (activityCode, sectionGroup) {
			schedulingService.createSharedActivity(activityCode, sectionGroup.id).then(function (newActivity) {
				$rootScope.$emit('toast', { message: "Created new shared " + activityCode.getActivityCodeDescription(), type: "SUCCESS" });
				var action = {
					type: CREATE_SHARED_ACTIVITY,
					payload: {
						activity: newActivity,
						sectionGroup: sectionGroup
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createActivity: function (activityCode, sectionId, sectionGroup) {
			schedulingService.createActivity(activityCode, sectionId).then(function (newActivity) {
				$rootScope.$emit('toast', { message: "Created new " + activityCode.getActivityCodeDescription(), type: "SUCCESS" });
				var action = {
					type: CREATE_ACTIVITY,
					payload: {
						activity: newActivity,
						sectionGroup: sectionGroup
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
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
		toggleCheckAll: function (sectionGroupIds) {
			var action = {
				type: CHECK_ALL_TOGGLED,
				payload: {
					sectionGroupIds: sectionGroupIds
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
		getCourseActivityTypes: function (course) {
			schedulingService.getCourseActivityTypes(course).then(function (activityTypes) {
				var action = {
					type: FETCH_COURSE_ACTIVITY_TYPES,
					payload: {
						activityTypes: activityTypes,
						course: course
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
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
		},
		updateLocationFilters: function (locationIds) {
			var action = {
				type: UPDATE_LOCATION_FILTERS,
				payload: {
					locationIds: locationIds
				}
			};
			schedulingStateService.reduce(action);
		},
		updateInstructorFilters: function (instructorIds) {
			var action = {
				type: UPDATE_INSTRUCTOR_FILTERS,
				payload: {
					instructorIds: instructorIds
				}
			};
			schedulingStateService.reduce(action);
		},
		createSection: function (section) {

			schedulingService.createSection(section).then(function (section) {
				$rootScope.$emit('toast', { message: "Created section " + section.sequenceNumber, type: "SUCCESS" });
				var action = {
					type: CREATE_SECTION,
					payload: {
						section: section
					}
				};
				schedulingStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});
