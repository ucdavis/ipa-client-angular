/**
 * @ngdoc service
 * @name registrarReconciliationReportApp.reportStateService
 * @description
 * # reportStateService
 * Service in the reportApp.
 * Central location for sharedState information.
 */
registrarReconciliationReportApp.service('reportStateService', function ($rootScope, $log, Term, Section, SyncAction) {
	return {
		_state: {},
		_sectionReducers: function (action, sections) {
			var section;
			switch (action.type) {
				case INIT_STATE:
					sections = {
						ids: []
					};
					var sectionList = {};
					var length = action.payload.sectionDiffs ? action.payload.sectionDiffs.length : 0;
					for (var i = 0; i < length; i++) {
						var ipaSectionData = action.payload.sectionDiffs[i].ipaSection;
						var dwSectionData = action.payload.sectionDiffs[i].dwSection;
						var sectionChanges = action.payload.sectionDiffs[i].changes;
						var syncActions = action.payload.sectionDiffs[i].syncActions;

						var sectionKey = null;
						// Calculate unique key of subj-course-seq, example : 'art-001-A01'
						if (ipaSectionData) {
							sectionKey = ipaSectionData.uniqueKey;
							sectionList[sectionKey] = new Section(ipaSectionData);
						} else if (dwSectionData) {
							sectionKey = dwSectionData.uniqueKey;
							sectionList[sectionKey] = new Section(dwSectionData);
						} else {
							continue;
						}

						if (sections.ids.indexOf(sectionKey) == -1) {
							sections.ids.push(sectionKey);
						}

						var slotSection = sectionList[sectionKey];

						// translate DiffView changes list into stateService language
						if (ipaSectionData != null && dwSectionData == null && sectionChanges == null) {
							// DW version does not exist
							slotSection.dwHasChanges = true;
							slotSection.noRemote = true;
						} else if (ipaSectionData == null && dwSectionData != null && sectionChanges == null) {
							// IPA version does not exist
							slotSection.dwHasChanges = true;
							slotSection.noLocal = true;
						} else if (sectionChanges.length === 0) {
							// DW version matches IPA!
							slotSection.dwHasChanges = false;
						} else {
							// DW version does have some changes
							slotSection.dwHasChanges = true;
							if (sectionChanges) {
								sectionChanges.forEach(function (change) {

									switch (change.propertyName) {
										case "instructors":
											// Code to handle instructors
											// DW missing instructor: Add a (noRemote) flag to ipaSection.instructors
											change.changes
												.filter(function (instructorChange) {
													return instructorChange.removedValue;
												}).forEach(function (instructorChange) {
													var uniqueKey = instructorChange.removedValue.cdoId;
													var instructor = _.find(slotSection.instructors, { uniqueKey: uniqueKey });
													instructor.noRemote = true;
												});
											// DW has extra instructors, flag them, then add them to the current section
											change.changes
												.filter(function (instructorChange) {
													return instructorChange.addedValue;
												}).map(function (instructorChange) {
													var instructor = _.find(dwSectionData.instructors, { uniqueKey: instructorChange.addedValue.cdoId });
													instructor.noLocal = true;
													return instructor;
												}).forEach(function (instructor) {
													var instructors = slotSection.instructors;
													instructors.push(instructor);
												});
											break;
										case "activities":
											// Code to handle activities
											// DW missing activity: Add a (noRemote) flag to corresponding ipa activity
											change.changes
												.filter(function (activityChange) {
													return activityChange.removedValue;
												}).forEach(function (activityChange) {
													var uniqueKey = activityChange.removedValue.cdoId;
													var activities = slotSection.activities;
													activities[activityChange.index].noRemote = true;
												});
											// DW has extra activities, flag them, then add them to the current section
											change.changes
												.filter(function (activityChange) {
													return activityChange.addedValue;
												}).map(function (activityChange) {
													var activity = dwSectionData.activities[activityChange.index];
													activity.noLocal = true;
													return activity;
												}).forEach(function (activity) {
													var activities = slotSection.activities;
													activities.push(activity);
												});
											break;
										case "bannerLocation":
										case "startTime":
										case "endTime":
										case "dayIndicator":
											activity = _.find(slotSection.activities, { uniqueKey: change.affectedLocalId });
											activity.dwChanges = activity.dwChanges || {};
											activity.dwChanges[change.propertyName] = { isToDo: false };
											activity.dwChanges[change.propertyName].value = change.right;
											break;
										case "crn":
										case "seats":
											slotSection.dwChanges = slotSection.dwChanges || {};
											slotSection.dwChanges[change.propertyName] = { isToDo: false };
											slotSection.dwChanges[change.propertyName].value = change.right;
											break;
										case undefined:
											// Skip changes that have no property specified
											return;
										default:
											// Unhandled properties, log them
											$log.debug("Unhandled diff property", change.propertyName);
											break;
									}
								});
							}
						}

						// Apply syncActions to section properties
						for (var s = 0; s < syncActions.length; s++) {
							slotSection = this._togglePropertyToDo(slotSection, syncActions[s]);
						}
					}

					sections.ids.sort();

					// Flag the first section in a sectionGroup as a groupHead
					var uniqSectionGroupKeys = [];
					sections.ids.forEach(function (id) {

						var sequencePattern = isNumber(sectionList[id].sequenceNumber) ?
							sectionList[id].sequenceNumber : sectionList[id].sequenceNumber.charAt(0);
						var uniqueKey = sectionList[id].uniqueKey;
						if (uniqSectionGroupKeys.indexOf(uniqueKey) < 0) {
							uniqSectionGroupKeys.push(uniqueKey);
							sectionList[id].groupHead = true;
						}
					});

					sections.list = sectionList;
					return sections;
				case UPDATE_SECTION:
					section = sections.list[action.payload.uniqueKey];
					// Apply the changes on the section
					section[action.payload.property] = action.payload.section[action.payload.property];
					// Delete the applied change from the dwChanges object
					delete section.dwChanges[action.payload.property];
					// Delete dwChanges if this was the last change
					if (Object.keys(section.dwChanges).length === 0) {
						delete section.dwChanges;
					}
					return sections;
				case ASSIGN_INSTRUCTOR:
					section = sections.list[action.payload.section.id];
					var instructorIndex = section.instructors.indexOf(action.payload.instructor);

					// Remove the noLocal flag from the assigned instructor
					delete section.instructors[instructorIndex].noLocal;

					return sections;
				case UNASSIGN_INSTRUCTOR:
					section = sections.list[action.payload.section.id];
					var instructorIndex = section.instructors.indexOf(action.payload.instructor);
					section.instructors.splice(instructorIndex, 1);
					return sections;
				case UPDATE_ACTIVITY:
					// Find other sections that might have this activity (shared activity)
					var otherSectionIds = sections.ids
						.filter(function (sid) {
							return sections.list[sid].activities
								.some(function (a) { return a.id == action.payload.activity.id; });
						});

					// Apply the requested changes to all matching activities
					otherSectionIds.forEach(function (sectionId) {
						section = sections.list[sectionId];
						var activity = _.find(section.activities, { id: action.payload.activity.id });
						// Apply the changes on the activity
						activity[action.payload.property] = action.payload.activity[action.payload.property];
						// Delete the applied change from the dwChanges object
						delete activity.dwChanges[action.payload.property];
						// Delete dwChanges if this was the last change
						if (Object.keys(activity.dwChanges).length === 0) {
							delete activity.dwChanges;
						}
					});

					return sections;
				case DELETE_ACTIVITY:
					// Find sections that have this activity
					var sectionIds = sections.ids
						.filter(function (sid) {
							return sections.list[sid].activities
								.some(function (a) { return a.id == action.payload.activity.id; });
						});

					// remove the activity from the section(s)
					sectionIds.forEach(function (sid) {
						var activityIndex = sections.list[sid].activities.indexOf(action.payload.activity);
						sections.list[sid].activities.splice(activityIndex, 1);
					});

					return sections;
				case CREATE_ACTIVITY:
					section = sections.list[action.payload.section.uniqueKey];
					// Set the id of the persisted activity
					section.activities[action.payload.activityIndex].id = action.payload.activity.id;
					// Remove the noLocal flag
					delete section.activities[action.payload.activityIndex].noLocal;
					return sections;
				case DELETE_SECTION:
					var idIndex = sections.ids.indexOf(action.payload.section.uniqueKey);
					sections.ids.splice(idIndex, 1);
					delete sections.list[action.payload.section.uniqueKey];
					return sections;
				case CREATE_SYNC_ACTION:
					section = sections.list[action.payload.syncAction.sectionId];
					if (!section) { return sections; }

					section = this._togglePropertyToDo(section, action.payload.syncAction);
					return sections;
				case DELETE_SYNC_ACTION:
					section = sections.list[action.payload.syncAction.sectionId];
					if (!section) { return sections; }

					section = this._togglePropertyToDo(section, action.payload.syncAction, true);
					return sections;
				default:
					return sections;
			}
		},
		_syncActionReducers: function (action, syncActions) {
			switch (action.type) {
				case INIT_STATE:
					syncActions = {
						ids: [],
					};
					var syncActionList = {};
					var payloadLength, syncActionLength;
					payloadLength = action.payload.sectionDiffs ? action.payload.sectionDiffs.length : 0;
					for (var i = 0; i < payloadLength; i++) {
						var sectionDiffData = action.payload.sectionDiffs[i];
						syncActionLength = action.payload.sectionDiffs[i].syncActions.length;
						for (var j = 0; j < syncActionLength; j++) {
							var syncActionData = sectionDiffData.syncActions[j];
							syncActionList[syncActionData.id] = new SyncAction(syncActionData);
						}
					}
					syncActions.ids = _array_sortIdsByProperty(syncActionList, "sectionId");
					syncActions.list = syncActionList;
					return syncActions;
				case CREATE_SYNC_ACTION:
					syncActions.list[action.payload.syncAction.id] = action.payload.syncAction;
					syncActions.ids.push(action.payload.syncAction.id);
					return syncActions;
				case DELETE_SYNC_ACTION:
					var syncActionIndex = syncActions.ids.indexOf(action.payload.syncAction.id);
					delete syncActions.list[action.payload.syncAction.id];
					syncActions.ids.splice(syncActionIndex, 1);
					return syncActions;
				default:
					return syncActions;
			}
		},
		_uiStateReducers: function (action, uiState) {
			switch (action.type) {
				case INIT_STATE:
					uiState = {};
					return uiState;
				default:
					return uiState;
			}
		},
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.syncActions = scope._syncActionReducers(action, scope._state.syncActions);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('reportStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Report state updated:");
			$log.debug(scope._state, action.type);
		},

		// ------------------------------- //
		// Helper methods used in reducers //
		// ------------------------------- //

		/**
		 * Finds the corresponding property or object in the section
		 * based on the syncAction, and toggles its isTodo flag
		 *
		 * @param section
		 * @param syncAction
		 * @returns modifiedSection
		 */
		_togglePropertyToDo: function (section, syncAction, isDelete) {
			var child;

			// Decide where to apply the todo flag based on the provided params
			if (syncAction.sectionProperty && syncAction.childUniqueKey && syncAction.childProperty) {
				// Toggle child property isTodo (examples: update dayIndicator, startTime...)
				child = section[syncAction.sectionProperty]
					.find(function (c) { return c.uniqueKey == syncAction.childUniqueKey; });
				if (child && child.dwChanges && child.dwChanges[syncAction.childProperty]) {
					child.dwChanges[syncAction.childProperty].isToDo = isDelete ? false : true;
				}
			} else if (syncAction.sectionProperty && syncAction.childUniqueKey) {
				// Toggle child isTodo (examples: add/remove entire instructor/activity)
				child = section[syncAction.sectionProperty]
					.find(function (c) {
						var keyMatches = (c.uniqueKey == syncAction.childUniqueKey);
						var hasChanges = (c.noLocal || c.noRemote);
						var notApplied = (isDelete && c.isToDo) || (!isDelete && !c.isToDo);
						return keyMatches && hasChanges && notApplied;
					});
				if (child) {
					child.isToDo = isDelete ? false : true;
				}
			} else if (syncAction.sectionProperty) {
				// Flag section property as todo (example: update seats)
				if (section.dwChanges && section.dwChanges[syncAction.sectionProperty]) {
					section.dwChanges[syncAction.sectionProperty].isToDo = isDelete ? false : true;
				}
			} else {
				// Flag the section itself as todo
				section.isToDo = isDelete ? false : true;
			}

			return section;
		}
	};
});
