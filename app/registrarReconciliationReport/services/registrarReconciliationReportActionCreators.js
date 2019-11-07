/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.RegistrarReconciliationReportActionCreators
 * @description
 * # reportActionCreators
 * Service in the reportApp.
 * Central location for sharedState information.
 */
class RegistrarReconciliationReportActionCreators {
	constructor (RegistrarReconciliationReportStateService, RegistrarReconciliationReportService, $rootScope, ActionTypes, AuthService, $route, Term) {
		this.RegistrarReconciliationReportStateService = RegistrarReconciliationReportStateService;
		this.RegistrarReconciliationReportService = RegistrarReconciliationReportService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function () {
				var termShortCode = $route.current.params.termShortCode;
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				if (!termShortCode) {
					var termStates = AuthService.getTermStates();
					// LINTME
					var termShortCode = calculateCurrentTermShortCode(termStates);// eslint-disable-line no-undef
				}
		
				var termCode = Term.prototype.getTermByTermShortCodeAndYear(termShortCode, $route.current.params.year).code;

				RegistrarReconciliationReportService.getTermComparisonReport(workgroupId, year, termCode).then(function (sectionDiffs) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: {
							sectionDiffs: sectionDiffs
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
				}, function () {
					$rootScope.$emit('toast', { message: "Could not load report initial state.", type: "ERROR" });
				});
			},
			calculateCurrentTermShortCode (termStates) {
				var earliestTermCode = null;

				termStates.forEach(function(termState) {
					if (termState.state == "ANNUAL_DRAFT") {
						if ((earliestTermCode == null) || earliestTermCode > termState.termCode) {
							earliestTermCode = termState.termCode;
						}
					}
				});
			
				// Default to fall quarter if current term cannot be deduced from termStates
				if (earliestTermCode == null) {
					return "10";
				}
			
				return earliestTermCode.slice(-2);
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
				var _this = this;
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
					_this.updateSectionReconciliation(updatedSection);
				}, function () {
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
				var _this = this;
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
					_this.updateSectionReconciliation(updatedActivity);
				}, function () {
					$rootScope.$emit('toast', { message: "Could not update activity.", type: "ERROR" });
				});
			},
			updateSectionReconciliation: function (updatedSection) {
				var sectionKey;
				var sections = RegistrarReconciliationReportStateService._state.sections;
				// When updatedSection is received after updateActivity()
				// Look for sectionKey by the id of the change
				if (updatedSection.activityState){
					sectionKey = sections.ids
					.filter(function (slotId) {
						return sections.list[slotId].activities
							.some(function (a) { return a.id == updatedSection.id; });
					});
				// When updatedSection is received after updateSection() or unAssignInstructor()
				// sectionKey is provided by updatedSection
				} else {
					sectionKey = sections.sectionsKeyById[updatedSection.id];
				}

					var slotSection = sections.list[sectionKey];

					// Check if slot instructors has changes
					var instructorsHasChanges = sections.ids
							.some(function (slotSectionKey) {
								if (sectionKey == slotSectionKey) {
								return sections.list[slotSectionKey].instructors
									.some(function (i) { return i.noRemote || i.noLocal; });
								}
							});

					// Check if slot activities has changes
					var activitiesHasChanges = sections.ids
							.some(function (slotSectionKey) {
								if (sectionKey == slotSectionKey) {
								return sections.list[slotSectionKey].activities
									.some(function (i) { return i.dwChanges || i.noLocal || i.noRemote; });
								}
							});

					// Check if slot section has changes
					var sectionHasChanges = slotSection.dwChanges;

					var dwHasChanges;
					if (instructorsHasChanges || activitiesHasChanges || sectionHasChanges){
						dwHasChanges = true;
					} else {
						dwHasChanges = false;
					}

				var action = {
					type: ActionTypes.UPDATE_SECTION_RECONCILIATION,
					payload: {
						sectionKey: sectionKey,
						dwHasChanges: dwHasChanges
					}
				};
				RegistrarReconciliationReportStateService.reduce(action);
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
				}, function () {
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
				var _this = this;
				// Set the time to match the server format
				var activity = section.activities[activityIndex];
				activity.startTime = moment(activity.startTime, "HHmm").format("HH:mm:ss"); // eslint-disable-line no-undef
				activity.endTime = moment(activity.endTime, "HHmm").format("HH:mm:ss"); // eslint-disable-line no-undef
	
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
					_this.updateSectionReconciliation(section);
				}, function () {
					$rootScope.$emit('toast', { message: "Could not create activity.", type: "ERROR" });
				});
			},
	
			createSection: function (section) {
				// Make start/end times IPA friendly format
				if (section.activities) {
					section.activities.forEach(function(activity) {
						activity.startTime = moment(activity.startTime, "HHmm").format("HH:mm:ss"); // eslint-disable-line no-undef
						activity.endTime = moment(activity.endTime, "HHmm").format("HH:mm:ss"); // eslint-disable-line no-undef
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
				}, function () {
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
				var _this = this;
				RegistrarReconciliationReportService.assignInstructor(section.sectionGroupId, instructor).then(function () {
					$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.ASSIGN_INSTRUCTOR,
						payload: {
							section: section,
							instructor: instructor
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
					_this.updateSectionReconciliation(section);
				}, function () {
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
				var _this = this;
				RegistrarReconciliationReportService.unAssignInstructor(section.sectionGroupId, instructor).then(function () {
					$rootScope.$emit('toast', { message: "Assigned " + instructor.firstName + " " + instructor.lastName + " to " + section.title, type: "SUCCESS" });
					var action = {
						type: ActionTypes.UNASSIGN_INSTRUCTOR,
						payload: {
							section: section,
							instructor: instructor
						}
					};
					RegistrarReconciliationReportStateService.reduce(action);
					_this.updateSectionReconciliation(section);
				}, function () {
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
				}, function () {
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
				}, function () {
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
				}, function () {
					$rootScope.$emit('toast', { message: "Could not delete to-do item.", type: "ERROR" });
				});
			}
		};	
	}
}

RegistrarReconciliationReportActionCreators.$inject = ['RegistrarReconciliationReportStateService', 'RegistrarReconciliationReportService', '$rootScope', 'ActionTypes', 'AuthService', '$route', 'Term'];

export default RegistrarReconciliationReportActionCreators;
