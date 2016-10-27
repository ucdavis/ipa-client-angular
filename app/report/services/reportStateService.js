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
						var sectionData = action.payload.sectionDiffs[i].section;
						var sectionChanges = action.payload.sectionDiffs[i].changes;
						sectionList[sectionData.id] = new Section(sectionData);

						// translate DiffView changes list into stateService language
						if (sectionChanges === null) {
							// DW version does not exist
							sectionList[sectionData.id].dwHasChanges = true;
							sectionList[sectionData.id].dwChanges = null;
						} else if (sectionChanges.length === 0) {
							// DW version matches IPA!
							sectionList[sectionData.id].dwHasChanges = false;
						} else {
							// DW version does have some changes
							sectionList[sectionData.id].dwHasChanges = true;
							sectionList[sectionData.id].dwChanges = {};
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
												var instructor = _.find(sectionList[sectionData.id].instructors, { uniqueKey: uniqueKey });
												instructor.noRemote = true;
											});
										// DW has extra instructor
										sectionList[sectionData.id].dwChanges[change.propertyName] = change.changes
											.filter(function (instructorChange) {
												return instructorChange.addedValue;
											}).map(function (instructorChange) {
												var instructorKeys = instructorChange.addedValue.cdoId.split("-");
												return {
													loginId: instructorKeys[0],
													ucdStudentSID: instructorKeys[1],
													uniqueKey: instructorChange.addedValue.cdoId,
													location: "DW"
												};
											});
										break;
									case "crn":
									case "seats":
										sectionList[sectionData.id].dwChanges[change.propertyName] = change.right;
										break;
									default:
										// Handle null/undefined/unknown property name
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
