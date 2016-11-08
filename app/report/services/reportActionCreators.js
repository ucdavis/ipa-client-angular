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
			reportService.updateSection(section).then(function (section) {
				$rootScope.$emit('toast', { message: "Updated section " + section.sequenceNumber + " " + property, type: "SUCCESS" });
				var action = {
					type: UPDATE_SECTION,
					payload: {
						section: section,
						property: property
					}
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		/**
		 * Assigns instructor to the sectionGroup
		 *
		 * @param sectionGroupId
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
		 * Updates a section and takes a property as an argument
		 * in order for the state service to clear that property
		 * from the dwChanges object
		 *
		 * @param section
		 * @param property
		 */
		addBannerToDoItem: function (entity, toDoAction, property, newValue) {
			$rootScope.$emit('toast', { message: "Added to Banner to-do list", type: "SUCCESS" });
			var action = {
				type: ADD_BANNER_TODO,
				payload: {
					entity: entity,
					toDoAction: toDoAction,
					property: property,
					newValue: newValue
				}
			};
			reportStateService.reduce(action);
		}
	};
});
