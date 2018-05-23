/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.RegistrarReconciliationReportActionCreators
 * @description
 * # reportActionCreators
 * Service in the reportApp.
 * Central location for sharedState information.
 */
class RegistrarReconciliationReportActionCreators {
	constructor (RegistrarReconciliationReportStateService, RegistrarReconciliationReportService, $rootScope, ActionTypes) {
		this.RegistrarReconciliationReportStateService = RegistrarReconciliationReportStateService;
		this.RegistrarReconciliationReportService = RegistrarReconciliationReportService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year, termCode) {
				RegistrarReconciliationReportService.getTermComparisonReport(workgroupId, year, termCode).then(function (sectionDiffs) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: {
							sectionDiffs: sectionDiffs
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load report initial state.", type: "ERROR" });
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
			updateSection: function (section, property, uniqueKey) {
				RegistrarReconciliationReportService.updateSection(section).then(function (updatedSection) {
					$rootScope.$emit('toast', { message: "Updated section " + updatedSection.sequenceNumber + " " + property, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SECTION,
						payload: {
							section: updatedSection,
							property: property,
							uniqueKey: uniqueKey
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update section.", type: "ERROR" });
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
				RegistrarReconciliationReportService.updateActivity(activity).then(function (updatedActivity) {
					$rootScope.$emit('toast', { message: "Updated " + activity.typeCode.getActivityCodeDescription() + " " + property, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_ACTIVITY,
						payload: {
							activity: updatedActivity,
							property: property
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update activity.", type: "ERROR" });
				});
			},
			/**
			 * Deletes an activity
			 *
			 * @param activity
			 */
			deleteActivity: function (activity) {
				RegistrarReconciliationReportService.deleteActivity(activity).then(function () {
					$rootScope.$emit('toast', { message: "Deleted " + activity.typeCode.getActivityCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.DELETE_ACTIVITY,
						payload: {
							activity: activity
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete activity.", type: "ERROR" });
				});
			},
			/**
			 * Creates an activity
			 *
			 * @param section
			 * @param activity
			 */
			createActivity: function (section, activityIndex) {
				// Set the time to match the server format
				var activity = section.activities[activityIndex];
				activity.startTime = moment(activity.startTime, "HHmm").format("HH:mm:ss");
				activity.endTime = moment(activity.endTime, "HHmm").format("HH:mm:ss");
	
				RegistrarReconciliationReportService.createActivity(section.id, activity).then(function (createdActivity) {
					$rootScope.$emit('toast', { message: "Created " + activity.typeCode.getActivityCodeDescription(), type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_ACTIVITY,
						payload: {
							section: section,
							activityIndex: activityIndex,
							activity: createdActivity
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create activity.", type: "ERROR" });
				});
			},
	
			createSection: function (section) {
				// Make start/end times IPA friendly format
				if (section.activities) {
					section.activities.forEach( function(activity) {
						activity.startTime = moment(activity.startTime, "HHmm").format("HH:mm:ss");
						activity.endTime = moment(activity.endTime, "HHmm").format("HH:mm:ss");
					});
				}
	
				RegistrarReconciliationReportService.createSection(section).then(function (sectionDiff) {
					$rootScope.$emit('toast', { message: "Created Section", type: "SUCCESS" });
	
					sectionDiff.changes = [];
					var action = {
						type: ActionTypes.CREATE_SECTION,
						payload: {
							sectionDiff: sectionDiff
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create section.", type: "ERROR" });
				});
			},
	
			/**
			 * Assigns instructor to the section's sectionGroup
			 *
			 * @param section
			 * @param instructor
			 */
			assignInstructor: function (section, instructor) {
				RegistrarReconciliationReportService.assignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
					$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.ASSIGN_INSTRUCTOR,
						payload: {
							section: section,
							instructor: instructor
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not assign instructor.", type: "ERROR" });
				});
			},
			/**
			 * Un-Assigns instructor from the section's sectionGroup
			 *
			 * @param section
			 * @param instructor
			 */
			unAssignInstructor: function (section, instructor) {
				RegistrarReconciliationReportService.unAssignInstructor(section.sectionGroupId, instructor).then(function (teachingAssingment) {
					$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UNASSIGN_INSTRUCTOR,
						payload: {
							section: section,
							instructor: instructor
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not unassign instructor.", type: "ERROR" });
				});
			},
			/**
			 * Deletes a section
			 *
			 * @param section
			 */
			deleteSection: function (section) {
				RegistrarReconciliationReportService.deleteSection(section).then(function () {
					$rootScope.$emit('toast', { message: "Deleted section " + section.sequenceNumber, type: "SUCCESS" });
					var action = {
						type: ActionTypes.DELETE_SECTION,
						payload: {
							section: section
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete section.", type: "ERROR" });
				});
			},
			/**
			 * Creates a SyncAction and sets the to-do flag on the specified section or its properties or children.
			 * This to-do flag can then be used to calculate the Banner todo list view.
			 *
			 * @param sectionId
			 * @param sectionProperty: i.e. seats, crn, activities, instructor. null value applies the to-do to the whole section
			 * @param childUniqueKey: can be an activity or an instructor uniqueKey
			 * @param childProperty: for activities this can be dayIndicator, startTime, endTime, location. null value applies the to-do to the whole activity
			 */
			createBannerToDoItem: function (sectionId, sectionProperty, childUniqueKey, childProperty, sectionUniqueKey, sectionGroupId) {
				var newSyncAction = {
					sectionId: sectionId,
					sectionProperty: sectionProperty,
					childUniqueKey: childUniqueKey,
					childProperty: childProperty,
					sectionGroupId: sectionGroupId
				};
	
				RegistrarReconciliationReportService.createSyncAction(newSyncAction).then(function (syncAction) {
					$rootScope.$emit('toast', { message: "Created to-do item", type: "SUCCESS" });
					var action = {
						type: ActionTypes.CREATE_SYNC_ACTION,
						payload: {
							syncAction: syncAction,
							sectionUniqueKey: sectionUniqueKey
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not create to-do item.", type: "ERROR" });
				});
			},
			/**
			 * Deletes the SyncAction and unsets the to-do flag on the specified section or its properties or children.
			 *
			 * @param sectionId
			 * @param sectionProperty: i.e. seats, crn, activities, instructor. null value applies the to-do to the whole section
			 * @param childUniqueKey: can be an activity or an instructor uniqueKey
			 * @param childProperty: for activities this can be dayIndicator, startTime, endTime, location. null value applies the to-do to the whole activity
			 */
			deleteBannerToDoItem: function (syncAction) {
				RegistrarReconciliationReportService.deleteSyncAction(syncAction.id).then(function () {
					$rootScope.$emit('toast', { message: "Deleted to-do item", type: "SUCCESS" });
					var action = {
						type: ActionTypes.DELETE_SYNC_ACTION,
						payload: {
							syncAction: syncAction
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not delete to-do item.", type: "ERROR" });
				});
			}
		};	
	}
}

RegistrarReconciliationReportActionCreators.$inject = ['RegistrarReconciliationReportStateService', 'RegistrarReconciliationReportService', '$rootScope', 'ActionTypes'];

export default RegistrarReconciliationReportActionCreators;
