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
					var length = action.payload.sections ? action.payload.sections.length : 0;
					for (var i = 0; i < length; i++) {
						var sectionData = action.payload.sections[i];
						sectionList[sectionData.id] = new Section(sectionData);

						// translate DiffView changes list into stateService language
						var sectionChanges = _.where(action.payload.changes, { "affectedLocalId": sectionData.uniqueKey });
						if (sectionChanges.length === 0) {
							// DW version matches IPA!
							sectionList[sectionData.id].dwChanges = {};
						} else if (sectionChanges.length === 1 && typeof sectionChanges[0].propertyName === "undefined") {
							// DW version does not exist
							sectionList[sectionData.id].dwChanges = null;
						} else {
							// DW version does have some changes
							sectionList[sectionData.id].dwChanges = {};
							sectionChanges.forEach(function (change) {
								sectionList[sectionData.id].dwChanges[sectionChanges[0].propertyName] = sectionChanges[0].right;
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
		reduce: function (action) {
			var scope = this;

			if (!action || !action.type) {
				return;
			}

			newState = {};
			newState.terms = scope._termReducers(action, scope._state.terms);
			newState.sections = scope._sectionReducers(action, scope._state.sections);

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
