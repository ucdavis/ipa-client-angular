class DeansOfficeReportReducers {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {
				budget: {},
				courses: {},
				sectionGroups: {},
				sections: {},
				instructorTypes: {},
				teachingAssignments: {},
				budgetScenarios: {},
				lineItems: {},
				lineItemCategories: {},
				instructorTypeCosts: {},
				instructorCosts: {},
				sectionGroupCosts: {}
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
			_lineItemCategoryReducers: function (action, lineItemCategories) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_LINE_ITEM_CATEGORIES:
					lineItemCategories.current = action.payload.lineItemCategories;
						return lineItemCategories;
					case ActionTypes.GET_PREVIOUS_LINE_ITEM_CATEGORIES:
					lineItemCategories.previous = action.payload.lineItemCategories;
						return lineItemCategories;
					default:
						return lineItemCategories;
				}
			},
			_instructorTypeCostReducers: function (action, instructorTypeCosts) {//
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_INSTRUCTOR_TYPE_COSTS:
					instructorTypeCosts.current = action.payload.instructorTypeCosts;
						return instructorTypeCosts;
					case ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPE_COSTS:
					instructorTypeCosts.previous = action.payload.instructorTypeCosts;
						return instructorTypeCosts;
					default:
						return instructorTypeCosts;
				}
			},

			_instructorCostReducers: function (action, instructorCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_INSTRUCTOR_COSTS:
					instructorCosts.current = action.payload.instructorCosts;
						return instructorCosts;
					case ActionTypes.GET_PREVIOUS_INSTRUCTOR_COSTS:
					instructorCosts.previous = action.payload.instructorCosts;
						return instructorCosts;
					default:
						return instructorCosts;
				}
			},
			_sectionGroupCostReducers: function (action, sectionGroupCosts) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_SECTION_GROUP_COSTS:
						sectionGroupCosts.current = action.payload.sectionGroupCosts;
						return sectionGroupCosts;
					case ActionTypes.GET_PREVIOUS_SECTION_GROUP_COSTS:
						sectionGroupCosts.previous = action.payload.sectionGroupCosts;
						return sectionGroupCosts;
					default:
						return sectionGroupCosts;
				}
			},
			_budgetScenarioReducers: function (action, budgetScenarios) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_BUDGET_SCENARIOS:
						budgetScenarios.current = action.payload.budgetScenarios;
						budgetScenarios.currentSelectedScenarioId = action.payload.budgetScenarios.ids[0];
						return budgetScenarios;
					case ActionTypes.GET_PREVIOUS_BUDGET_SCENARIOS:
						budgetScenarios.previous = action.payload.budgetScenarios;
						budgetScenarios.previousSelectedScenarioId = action.payload.budgetScenarios.ids[0];
						return budgetScenarios;
					case ActionTypes.SELECT_CURRENT_BUDGET_SCENARIO:
						budgetScenarios.currentSelectedScenarioId = action.payload.budgetScenarioId;
						return budgetScenarios;
					case ActionTypes.SELECT_PREVIOUS_BUDGET_SCENARIO:
						budgetScenarios.previousSelectedScenarioId = action.payload.budgetScenarioId;
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
				newState.lineItemCategories = scope._lineItemCategoryReducers(action, scope._state.lineItemCategories);
				newState.instructorTypeCosts = scope._instructorTypeCostReducers(action, scope._state.instructorTypeCosts);
				newState.instructorCosts = scope._instructorCostReducers(action, scope._state.instructorCosts);
				newState.sectionGroupCosts = scope._sectionGroupCostReducers(action, scope._state.sectionGroupCosts);

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
