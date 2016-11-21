/**
 * @ngdoc service
 * @name reportApp.reportStateService
 * @description
 * # reportStateService
 * Service in the reportApp.
 * Central location for sharedState information.
 */
reportApp.service('reportStateService', function ($rootScope, $log, Term, Section) {
	return {
		_state: {},
		_termReducers: function (action, terms) {
			switch (action.type) {
				case INIT_STATE:
					terms = {
						ids: []
					};
					var termList = {};
					var length = action.payload ? action.payload.length : 0;
					for (var i = 0; i < length; i++) {
						var termData = action.payload[i];
						// Using termCode as key since the Term does not have an id
						termList[termData.termCode] = new Term(termData);
					}
					terms.ids = _array_sortIdsByProperty(termList, "termCode");
					terms.list = termList;
					return terms;
				default:
					return terms;
			}
		},
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
						sectionList[ipaSectionData.id] = new Section(ipaSectionData);

						// translate DiffView changes list into stateService language
						if (sectionChanges === null) {
							// DW version does not exist
							sectionList[ipaSectionData.id].dwHasChanges = true;
							sectionList[ipaSectionData.id].noRemote = true;
						} else if (sectionChanges.length === 0) {
							// DW version matches IPA!
							sectionList[ipaSectionData.id].dwHasChanges = false;
						} else {
							// DW version does have some changes
							sectionList[ipaSectionData.id].dwHasChanges = true;
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
												var instructor = _.find(sectionList[ipaSectionData.id].instructors, { uniqueKey: uniqueKey });
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
												var instructors = sectionList[ipaSectionData.id].instructors;
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
												var activities = sectionList[ipaSectionData.id].activities;
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
												var activities = sectionList[ipaSectionData.id].activities;
												activities.push(activity);
											});
										break;
									case "bannerLocation":
									case "startTime":
									case "endTime":
									case "dayIndicator":
										activity = _.find(sectionList[ipaSectionData.id].activities, { uniqueKey: change.affectedLocalId });
										activity.dwChanges = activity.dwChanges || {};
										activity.dwChanges[change.propertyName] = { isToDo: false };
										activity.dwChanges[change.propertyName].value = change.right;
										break;
									case "crn":
									case "seats":
										sectionList[ipaSectionData.id].dwChanges = sectionList[ipaSectionData.id].dwChanges || {};
										sectionList[ipaSectionData.id].dwChanges[change.propertyName] = { isToDo: false };
										sectionList[ipaSectionData.id].dwChanges[change.propertyName].value = change.right;
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
					sections.ids = _array_sortIdsByProperty(sectionList, ["subjectCode", "courseNumber", "sequenceNumber"]);

					// Flag the first section in a sectionGroup as a groupHead
					var uniqSectionGroupKeys = [];
					sections.ids.forEach(function (id) {
						var uniqueKey = sectionList[id].subjectCode + '-' + sectionList[id].courseNumber;
						if (uniqSectionGroupKeys.indexOf(uniqueKey) < 0) {
							uniqSectionGroupKeys.push(uniqueKey);
							sectionList[id].groupHead = true;
						}
					});

					sections.list = sectionList;
					return sections;
				case UPDATE_SECTION:
					section = sections.list[action.payload.section.id];
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
					section = sections.list[action.payload.section.id];
					// Set the id of the persisted activity
					section.activities[action.payload.activityIndex].id = action.payload.activity.id;
					// Remove the noLocal flag
					delete section.activities[action.payload.activityIndex].noLocal;
					return sections;
				case DELETE_SECTION:
					var idIndex = sections.ids.indexOf(action.payload.section.id);
					sections.ids.splice(idIndex, 1);
					delete sections.list[action.payload.section.id];
					return sections;
				case TOGGLE_BANNER_TODO:
					// Mandatory params
					section = sections.list[action.payload.sectionId];
					if (!section) { return sections; }

					// Optional params
					var sectionProperty = action.payload.sectionProperty;
					var childUniqueKey = action.payload.childUniqueKey;
					var childProperty = action.payload.childProperty;

					// Decide where to apply the todo flag based on the provided params
					if (sectionProperty && childUniqueKey && childProperty) {
						// Toggle child property isTodo (examples: update dayIndicator, startTime...)
						var child = section[sectionProperty].find(function (c) { return c.uniqueKey == childUniqueKey; });
						child.dwChanges[childProperty].isToDo = !child.dwChanges[childProperty].isToDo;
					} else if (sectionProperty && childUniqueKey) {
						// Toggle child isTodo (examples: add/remove entire instructor/activity)
						var child = section[sectionProperty].find(function (c) { return c.uniqueKey == childUniqueKey; });
						child.isToDo = !child.isToDo;
					} else if (sectionProperty) {
						// Flag section property as todo (example: update seats)
						section.dwChanges[sectionProperty].isToDo = !section.dwChanges[sectionProperty].isToDo;
					} else {
						// Flag the section itself as todo
						section.isToDo = !section.isToDo;
					}

					return sections;
				default:
					return sections;
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
			newState.terms = scope._termReducers(action, scope._state.terms);
			newState.sections = scope._sectionReducers(action, scope._state.sections);
			newState.uiState = scope._uiStateReducers(action, scope._state.uiState);

			scope._state = newState;
			$rootScope.$emit('reportStateChanged', {
				state: scope._state,
				action: action
			});

			$log.debug("Report state updated:");
			$log.debug(scope._state, action.type);
		}
	};
});
