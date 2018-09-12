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
			setDepartmentalRoomsDay: function (day) {
				SchedulingStateService.reduce({
					type: ActionTypes.SET_DEPARTMENTAL_ROOMS_DAY,
					payload: {
						day: day
					}
				});
			},
			updateActivity: function (activity) {
				var _this = this;
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
			shouldClearSelection: function (tagIds, locationIds, instructorIds) {
				var selectedCourseId = SchedulingStateService._state.uiState.selectedCourseId;
				var selectedSectionGroupId = SchedulingStateService._state.uiState.selectedSectionGroupId;
				var selectedActivityId = SchedulingStateService._state.uiState.selectedActivityId;

				var selectedCourse = selectedCourseId ? SchedulingStateService._state.courses.list[selectedCourseId] : null;
				var selectedSectionGroup = selectedSectionGroupId ? SchedulingStateService._state.sectionGroups.list[selectedSectionGroupId] : null;
				var selectedActivity = selectedActivityId ? SchedulingStateService._state.activities.list[selectedActivityId] : null;

				var tagFilterIds = tagIds || SchedulingStateService._state.filters.enabledTagIds;
				var locationFilterIds = locationIds || SchedulingStateService._state.filters.enabledLocationIds;
				var instructorFilterIds = instructorIds || SchedulingStateService._state.filters.enabledInstructorIds;

				if (selectedCourse && tagFilterIds && tagFilterIds.length > 0) {
					var passesFilter = false;

					tagFilterIds.forEach(function(tagId) {
						if (selectedCourse.tagIds.indexOf(tagId) > -1) {
							passesFilter = true;
						}
					});

					if (passesFilter == false) { return false; }
				}

				if (selectedSectionGroup && instructorFilterIds && instructorFilterIds.length > 0) {
					var passesFilter = false;

					instructorFilterIds.forEach(function(instructorId) {
						if (selectedSectionGroup.instructorIds.indexOf(instructorId) > -1) {
							passesFilter = true;
						}
					});

					if (passesFilter == false) { return false; }
				}

				if (selectedActivity && locationFilterIds && locationFilterIds.length > 0) {
					var passesFilter = false;

					locationFilterIds.forEach(function(locationId) {
						if (selectedActivity.locationId == locationId) {
							passesFilter = true;
						}
					});

					if (passesFilter == false) { return false; }
				}

				return true;
			},
			filterCheckedSectionGroups: function (tagIds, locationIds, instructorIds) {
				var _this = this;

				var checkedSectionGroupIds = SchedulingStateService._state.uiState.checkedSectionGroupIds;

				var tagFilterIds = tagIds || SchedulingStateService._state.filters.enabledTagIds;
				var instructorFilterIds = instructorIds || SchedulingStateService._state.filters.enabledInstructorIds;
				var locationFilterIds = locationIds || SchedulingStateService._state.filters.enabledLocationIds;

				var filteredCheckedSectionGroupIds = [];

				checkedSectionGroupIds.forEach(function(sectionGroupId) {
					var passesFilter = false;

					var sectionGroup = SchedulingStateService._state.sectionGroups.list[sectionGroupId];
					var course = SchedulingStateService._state.courses.list[sectionGroup.courseId];

					instructorFilterIds.forEach(function(instructorId) {
						if (sectionGroup.instructorIds.indexOf(instructorId) > -1) {
							passesFilter = true;
						}
					});

					tagFilterIds.forEach(function(tagId) {
						if (course.tagIds.indexOf(tagId) > -1) {
							passesFilter = true;
						}
					});

					locationFilterIds.forEach(function(locationId) {
						if (_this.sectionGroupHasLocation(sectionGroup, locationId)) {
							passesFilter = true;
						}
					});

					if (passesFilter) {
						filteredCheckedSectionGroupIds.push(sectionGroupId);
					}
				});

				return filteredCheckedSectionGroupIds;
			},
			sectionGroupHasLocation: function(sectionGroup, locationId) {
				var passesFilter = false;

				sectionGroup.sectionIds.forEach(function(sectionId) {
					var section = SchedulingStateService._state.sections.list[sectionId];
					debugger;
					// TODO: find all activities for section, determine if activity matches the location
				});

				return passesFilter;
			},
			setCalendarMode: function(tab) {
				SchedulingStateService.reduce({
					type: ActionTypes.SELECT_CALENDAR_MODE,
					payload: {
						tab: tab
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
				var _this = this;

				var action = {
					type: ActionTypes.UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds,
						shouldClearSelection: _this.shouldClearSelection(tagIds, null, null),
						checkedSectionGroupIds: _this.filterCheckedSectionGroups(tagIds, null, null)
					}
				};
				SchedulingStateService.reduce(action);
			},
			updateLocationFilters: function (locationIds) {
				var _this = this;

				var action = {
					type: ActionTypes.UPDATE_LOCATION_FILTERS,
					payload: {
						locationIds: locationIds,
						shouldClearSelection: _this.shouldClearSelection(null, locationIds, null),
						checkedSectionGroupIds: _this.filterCheckedSectionGroups(null, locationIds, null)
					}
				};
				SchedulingStateService.reduce(action);
			},
			updateInstructorFilters: function (instructorIds) {
				var _this = this;

				var action = {
					type: ActionTypes.UPDATE_INSTRUCTOR_FILTERS,
					payload: {
						instructorIds: instructorIds,
						shouldClearSelection: _this.shouldClearSelection(null, null, instructorIds),
						checkedSectionGroupIds: _this.filterCheckedSectionGroups(null, null, instructorIds)
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
