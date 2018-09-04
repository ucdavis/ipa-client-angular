/**
 * @ngdoc service
 schedulingApp.schedulingActionCreators
 * @description
 * # schedulingActionCreators
 schedulingApp.
 * Central location for sharedState information.
 */
class SchedulingActionCreators {
	constructor (SchedulingStateService, SchedulingService, $rootScope, Role, ActionTypes, $route, Term) {
		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var termShortCode = $route.current.params.termShortCode;
				var termCode = Term.prototype.getTermByTermShortCodeAndYear(termShortCode, year).code;

				SchedulingService.getScheduleByWorkgroupIdAndYearAndTermCode(workgroupId, year, termCode).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load schedule initial state.", type: "ERROR" });
				});
			},
			updateActivity: function (activity) {
				SchedulingService.updateActivity(activity).then(function (updatedActivity) {
					$rootScope.$emit('toast', { message: "Updated " + activity.getCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_ACTIVITY,
						payload: {
							activity: updatedActivity
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update activity.", type: "ERROR" });
				});
			},
			selectCalendarMode: function(tab) {
				BudgetReducers.reduce({
					type: ActionTypes.SELECT_CALENDAR_MODE,
					payload: {
						activeTermTab: tab
					}
				});
			},
			removeActivity: function (activity) {
				SchedulingService.removeActivity(activity.id).then(function () {
					$rootScope.$emit('toast', { message: "Removed " + activity.getCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_ACTIVITY,
						payload: {
							activity: activity
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not remove activity.", type: "ERROR" });
				});
			},
			createSharedActivity: function (activityCode, sectionGroup) {
				SchedulingService.createSharedActivity(activityCode, sectionGroup.id).then(function (newActivity) {
					$rootScope.$emit('toast', { message: "Created new shared " + activityCode.getActivityCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_SHARED_ACTIVITY,
						payload: {
							activity: newActivity,
							sectionGroup: sectionGroup
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create shared activity.", type: "ERROR" });
				});
			},
			createActivity: function (activityCode, sectionId, sectionGroup) {
				SchedulingService.createActivity(activityCode, sectionId).then(function (newActivity) {
					$rootScope.$emit('toast', { message: "Created new " + activityCode.getActivityCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_ACTIVITY,
						payload: {
							activity: newActivity,
							sectionGroup: sectionGroup
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create activity.", type: "ERROR" });
				});
			},
			setSelectedSectionGroup: function (sectionGroup) {
				var action = {
					type: ActionTypes.SECTION_GROUP_SELECTED,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				SchedulingStateService.reduce(action);
			},
			toggleCheckedSectionGroup: function (sectionGroupId) {
				var action = {
					type: ActionTypes.SECTION_GROUP_TOGGLED,
					payload: {
						sectionGroupId: sectionGroupId
					}
				};
				SchedulingStateService.reduce(action);
			},
			toggleCheckAll: function (sectionGroupIds) {
				var action = {
					type: ActionTypes.CHECK_ALL_TOGGLED,
					payload: {
						sectionGroupIds: sectionGroupIds
					}
				};
				SchedulingStateService.reduce(action);
			},
			setSelectedActivity: function (activity) {
				var action = {
					type: ActionTypes.ACTIVITY_SELECTED,
					payload: {
						activity: activity
					}
				};
				SchedulingStateService.reduce(action);
			},
			getCourseActivityTypes: function (course) {
				SchedulingService.getCourseActivityTypes(course).then(function (activityTypes) {
					var action = {
						type: ActionTypes.FETCH_COURSE_ACTIVITY_TYPES,
						payload: {
							activityTypes: activityTypes,
							course: course
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not get course activity types.", type: "ERROR" });
				});
			},
			toggleDay: function (dayIndex) {
				var action = {
					type: ActionTypes.TOGGLE_DAY,
					payload: {
						dayIndex: dayIndex
					}
				};
				SchedulingStateService.reduce(action);
			},
			updateTagFilters: function (tagIds) {
				var action = {
					type: ActionTypes.UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds
					}
				};
				SchedulingStateService.reduce(action);
			},
			updateLocationFilters: function (locationIds) {
				var action = {
					type: ActionTypes.UPDATE_LOCATION_FILTERS,
					payload: {
						locationIds: locationIds
					}
				};
				SchedulingStateService.reduce(action);
			},
			updateInstructorFilters: function (instructorIds) {
				var action = {
					type: ActionTypes.UPDATE_INSTRUCTOR_FILTERS,
					payload: {
						instructorIds: instructorIds
					}
				};
				SchedulingStateService.reduce(action);
			},
			createSection: function (section) {
				var self = this;
				SchedulingService.createSection(section).then(function (section) {
					$rootScope.$emit('toast', { message: "Created section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_SECTION,
						payload: {
							section: section
						}
					};
					SchedulingStateService.reduce(action);

					// Server potentially created new activities as well
					self.getActivities(section);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create section activities.", type: "ERROR" });
				});
			},
			removeSection: function (section) {
				var self = this;
				SchedulingService.deleteSection(section).then(function (results) {
					$rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.DELETE_SECTION,
						payload: {
							section: section
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete section.", type: "ERROR" });
				});
			},
			getActivities: function (section) {
				SchedulingService.getActivities(section).then(function (activities) {
					var action = {
						type: ActionTypes.GET_ACTIVITIES,
						payload: {
							section: section,
							activities: activities
						}
					};
					SchedulingStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not get activities.", type: "ERROR" });
				});
			}
		};
	}
}

SchedulingActionCreators.$inject = ['SchedulingStateService', 'SchedulingService', '$rootScope', 'Role', 'ActionTypes', '$route', 'Term'];

export default SchedulingActionCreators;
