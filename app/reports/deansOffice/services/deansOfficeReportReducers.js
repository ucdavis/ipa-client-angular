class DeansOfficeReportReducers {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {
				budget: {},
				courses: {},
				sectionGroups: {},
				sections: {},
				instructorTypes: {},
				teachingAssignments: {}
			},
			_budgetReducer: function (action, budget) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_BUDGET:
						budget.current = action.payload.budget;
						return budget;
					case ActionTypes.GET_PREVIOUS_BUDGET:
						budget.previous = action.payload.budget;
						return budget;
					default:
						return budget;
				}
			},
			_lineItemReducers: function (action, lineItems) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_LINE_ITEMS:
					lineItems.current = action.payload.lineItems;
						return lineItems;
					case ActionTypes.GET_PREVIOUS_LINE_ITEMS:
					lineItems.previous = action.payload.lineItems;
						return lineItems;
					default:
						return lineItems;
				}
			},
			_budgetScenarioReducers: function (action, budgetScenarios) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_BUDGET_SCENARIOS:
					budgetScenarios.current = action.payload.budgetScenarios;
						return budgetScenarios;
					case ActionTypes.GET_PREVIOUS_BUDGET_SCENARIOS:
					budgetScenarios.previous = action.payload.budgetScenarios;
						return budgetScenarios;
					default:
						return budgetScenarios;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_COURSES:
						courses.current = action.payload.courses;
						return courses;
					case ActionTypes.GET_PREVIOUS_COURSES:
						courses.previous = action.payload.courses;
						return courses;
					default:
						return courses;
				}
			},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_SECTION_GROUPS:
						sectionGroups.current = action.payload.sectionGroups;
						return sectionGroups;
					case ActionTypes.GET_PREVIOUS_SECTION_GROUPS:
						sectionGroups.previous = action.payload.sectionGroups;
						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_sectionReducers: function (action, sections) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_SECTIONS:
						sections.current = action.payload.sections;
						return sections;
					case ActionTypes.GET_PREVIOUS_SECTIONS:
						sections.previous = action.payload.sections;
						return sections;
					default:
						return sections;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_INSTRUCTOR_TYPES:
						instructorTypes.current = action.payload.instructorTypes;
						return instructorTypes;
					case ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPES:
						instructorTypes.previous = action.payload.instructorTypes;
						return instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_teachingAssignmentReducers: function (action, teachingAssignments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_TEACHING_ASSIGNMENTS:
						teachingAssignments.current = action.payload.teachingAssignments;
						return teachingAssignments;
					case ActionTypes.GET_PREVIOUS_TEACHING_ASSIGNMENTS:
						teachingAssignments.previous = action.payload.teachingAssignments;
						return teachingAssignments;
					default:
						return teachingAssignments;
				}
			},
			_calculationReducers: function (action, calculations) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						calculations = {
							isCurrentYearFetchComplete: false,
							isPreviousYearFetchComplete: false
						};
						return calculations;
					case ActionTypes.CALCULATE_VIEW:
						calculations.calculatedView = action.payload.calculatedView;
						return calculations;
					case ActionTypes.PREVIOUS_YEAR_FETCH_COMPLETE:
						calculations.isPreviousYearFetchComplete = action.payload.isPreviousYearFetchComplete;
						return calculations;
					case ActionTypes.CURRENT_YEAR_FETCH_COMPLETE:
						calculations.isCurrentYearFetchComplete = action.payload.isCurrentYearFetchComplete;
						return calculations;
					default:
						return calculations;
				}
			},
			reduce: function (action) {
				var scope = this;

				let newState = {};
				newState.budget = scope._budgetReducer(action, scope._state.budget);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.sections = scope._sectionReducers(action, scope._state.sections);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.lineItems = scope._lineItemReducers(action, scope._state.lineItems);
				newState.budgetScenarios = scope._budgetScenarioReducers(action, scope._state.budgetScenarios);

				newState.calculations = scope._calculationReducers(action, scope._state.calculations);

				scope._state = newState;
				$rootScope.$emit('deansOfficeReportStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};
	}
}

DeansOfficeReportReducers.$inject = ['$rootScope', 'ActionTypes'];

export default DeansOfficeReportReducers;
