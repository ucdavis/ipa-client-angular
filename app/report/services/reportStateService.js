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
			var scope = this;

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
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					sections = {
						ids: []
					};
					return sections;
				case GET_TERM_COMPARISON_REPORT:
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
							sectionList[ipaSectionData.id].dwChanges = null;
						} else if (sectionChanges.length === 0) {
							// DW version matches IPA!
							sectionList[ipaSectionData.id].dwHasChanges = false;
						} else {
							// DW version does have some changes
							sectionList[ipaSectionData.id].dwHasChanges = true;
							sectionList[ipaSectionData.id].dwChanges = {};
							sectionChanges.forEach(function (change) {
								var changeId = change.affectedLocalId;
								sectionList[ipaSectionData.id].dwChanges[changeId] = sectionList[ipaSectionData.id].dwChanges[changeId] || {};
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
										// DW has extra instructor
										sectionList[ipaSectionData.id].dwChanges[changeId][change.propertyName] = change.changes
											.filter(function (instructorChange) {
												return instructorChange.addedValue;
											}).map(function (instructorChange) {
												return _.find(dwSectionData.instructors, { uniqueKey: instructorChange.addedValue.cdoId });
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
										// DW has extra activity
										sectionList[ipaSectionData.id].dwChanges[changeId][change.propertyName] = change.changes
											.filter(function (activityChange) {
												return activityChange.addedValue;
											}).map(function (activityChange) {
												var activities = sectionList[ipaSectionData.id].activities;
												return activities[activityChange.index];
											});
										console.log(sectionList[ipaSectionData.id]);
										break;
									case "location":
									case "startTime":
									case "endTime":
									case "dayIndicator":
									case "crn":
									case "seats":
										sectionList[ipaSectionData.id].dwChanges[changeId][change.propertyName] = change.right;
										break;
									case undefined:
										// Handle undefined property, currently no special action
										break;
									default:
										// Unhandled properties, log them
										$log.debug("Unhandled diff property", change.propertyName);
										break;
								}
							});
						}
					}
					sections.ids = _array_sortIdsByProperty(sectionList, ["subjectCode", "courseNumber", "sequenceNumber"]);
					sections.list = sectionList;
					return sections;
				default:
					return sections;
			}
		},
		_uiStateReducers: function (action, uiState) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					uiState = {
						comparisonInProgress: false
					};
					return uiState;
				case BEGIN_COMPARISON:
					uiState.comparisonInProgress = true;
					return uiState;
				case GET_TERM_COMPARISON_REPORT:
					uiState.comparisonInProgress = false;
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
