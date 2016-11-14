/**
 * @ngdoc service
 * @name reportApp.reportActionCreators
 * @description
 * # reportActionCreators
 * Service in the reportApp.
 * Central location for sharedState information.
 */
reportApp.service('reportActionCreators', function (reportStateService, reportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year) {
			reportService.getSchedulesToCompare(workgroupId).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		beginComparison: function () {
			var action = {
				type: BEGIN_COMPARISON,
				payload: {}
			};
			reportStateService.reduce(action);
		},
		getTermComparisonReport: function (workgroupId, year, termCode) {
			reportService.getTermComparisonReport(workgroupId, year, termCode).then(function (sectionDiffs) {
				var action = {
					type: GET_TERM_COMPARISON_REPORT,
					payload: {
						sectionDiffs: sectionDiffs
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Updates a section and takes a property as an argument
		 * in order for the state service to clear that property
		 * from the dwChanges object
		 *
		 * @param section
		 * @param property
		 */
		updateSection: function (section, property) {
			reportService.updateSection(section).then(function (updatedSection) {
				$rootScope.$emit('toast', { message: "Updated section " + updatedSection.sequenceNumber + " " + property, type: "SUCCESS" });
				var action = {
					type: UPDATE_SECTION,
					payload: {
						section: updatedSection,
						property: property
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Updates an activity and takes a property as an argument
		 * in order for the state service to clear that property
		 * from the dwChanges object
		 *
		 * @param activity
		 * @param property
		 */
		updateActivity: function (activity, property) {
			reportService.updateActivity(activity).then(function (updatedActivity) {
				$rootScope.$emit('toast', { message: "Updated " + activity.typeCode.getActivityCodeDescription() + " " + property, type: "SUCCESS" });
				var action = {
					type: UPDATE_ACTIVITY,
					payload: {
						activity: updatedActivity,
						property: property
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Assigns instructor to the section's sectionGroup
		 *
		 * @param section
		 * @param instructor
		 */
		assignInstructor: function (section, instructor) {
			reportService.assignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
				$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
				var action = {
					type: ASSIGN_INSTRUCTOR,
					payload: {
						section: section,
						instructor: instructor
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Un-Assigns instructor from the section's sectionGroup
		 *
		 * @param section
		 * @param instructor
		 */
		unAssignInstructor: function (section, instructor) {
			reportService.unAssignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
				$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
				var action = {
					type: UNASSIGN_INSTRUCTOR,
					payload: {
						section: section,
						instructor: instructor
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Adds the to-do flag to the specified section or its properties or children. This to-do flag can then
		 * be used to calculate the Banner todo list view.
		 *
		 * @param section
		 * @param sectionProperty: i.e. seats, crn, activities, instructor. null value applies the to-do to the whole section
		 * @param child: can be an activity or an instructor
		 * @param childProperty: for activities this can be dayIndicator, startTime, endTime, location. null value applies the to-do to the whole activity
		 */
		addBannerToDoItem: function (section, sectionProperty, child, childProperty) {
			$rootScope.$emit('toast', { message: "Added to Banner to-do list", type: "SUCCESS" });
			var action = {
				type: ADD_BANNER_TODO,
				payload: {
					section: section,
					sectionProperty: sectionProperty,
					child: child,
					childProperty: childProperty
				}
			};
			reportStateService.reduce(action);
		}
	};
});
