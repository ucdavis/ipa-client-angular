class BudgetComparisonReportReducers {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {
				budget: {},
				courses: {},
				sectionGroups: {},
				sectionGroupCostInstructors: {},
				sections: {},
				instructorTypes: {},
				teachingAssignments: {},
				budgetScenarios: {},
				lineItems: {},
				lineItemCategories: {},
				expenseItems: {},
				expenseItemTypes: {},
				instructorTypeCosts: {},
				instructorCosts: {},
				sectionGroupCosts: {},
				userWorkgroupsScenarios: {},
				ui: {}
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
					case ActionTypes.TOGGLE_FILTER:
						lineItems = action.payload.lineItems;
						return lineItems;
					default:
						return lineItems;
				}
			},
			_expenseItemReducers: function (action, expenseItems) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_EXPENSE_ITEMS:
						expenseItems.current = action.payload.expenseItems;
						return expenseItems;
					case ActionTypes.GET_PREVIOUS_EXPENSE_ITEMS:
						expenseItems.previous = action.payload.expenseItems;
						return expenseItems;
					case ActionTypes.TOGGLE_FILTER:
						expenseItems = action.payload.expenseItems;
						return expenseItems;
					default:
						return expenseItems;
				}
			},
			_userReducers: function (action, users) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_USERS:
						users = action.payload.users;
						return users;
					default:
						return users;
				}
			},
			_userRoleReducers: function (action, userRoles) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_USER_ROLES:
					userRoles = action.payload.userRoles;
						return userRoles;
					default:
						return userRoles;
				}
			},
			_userWorkgroupsScenariosReducers: function (action, userWorkgroupsScenarios) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_USER_WORKGROUPS_SCENARIOS:
						userWorkgroupsScenarios = action.payload.userWorkgroupsScenarios;
						return userWorkgroupsScenarios;
					default:
						return userWorkgroupsScenarios;
				}
			},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_INSTRUCTORS:
					instructors = action.payload.instructors;
						return instructors;
					default:
						return instructors;
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
			_expenseItemTypeReducers: function (action, expenseItemTypes) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return {};
					case ActionTypes.GET_CURRENT_EXPENSE_ITEM_TYPES:
					expenseItemTypes.current = action.payload.expenseItemTypes;
						return expenseItemTypes;
					case ActionTypes.GET_PREVIOUS_EXPENSE_ITEM_TYPES:
					expenseItemTypes.previous = action.payload.expenseItemTypes;
						return expenseItemTypes;
					default:
						return expenseItemTypes;
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
					case ActionTypes.TOGGLE_FILTER:
						sectionGroupCosts = action.payload.sectionGroupCosts;
						return sectionGroupCosts;
					default:
						return sectionGroupCosts;
				}
			},
			_sectionGroupCostInstructorReducers: function (action, sectionGroupCostInstructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return  {};
					case ActionTypes.GET_PREVIOUS_SECTION_GROUP_COST_INSTRUCTORS:
						sectionGroupCostInstructors.previous = {
							instructors: action.payload.sectionGroupCostInstructors,
							teachingAssignmentIds: action.payload.teachingAssignmentIds
						};
						return sectionGroupCostInstructors;
					case ActionTypes.GET_CURRENT_SECTION_GROUP_COST_INSTRUCTORS:
						sectionGroupCostInstructors.current = {
							instructors: action.payload.sectionGroupCostInstructors,
							teachingAssignmentIds: action.payload.teachingAssignmentIds
						};
						return sectionGroupCostInstructors;
					default:
						return sectionGroupCostInstructors;
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
			_uiReducers: function (action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						ui = { filters: [], showDownloadModal: false, years: {previous: [], current: []} };
						return ui;
					case ActionTypes.GET_SCENARIO_YEARS:
						ui.years.previous = action.payload.years.slice(0, -1);
						ui.years.current = action.payload.years;
						return ui;
					case ActionTypes.GENERATE_FILTERS:
						ui.filters = action.payload.filters;
						return ui;
					case ActionTypes.TOGGLE_FILTER:
						ui.filters = action.payload.filters;
						return ui;
					case ActionTypes.TOGGLE_DOWNLOAD_MODAL:
						ui.showDownloadModal = !ui.showDownloadModal;
						return ui;
					default:
						return ui;
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
				newState.expenseItems = scope._expenseItemReducers(action, scope._state.expenseItems);
				newState.expenseItemTypes = scope._expenseItemTypeReducers(action, scope._state.expenseItemTypes);
				newState.instructorTypeCosts = scope._instructorTypeCostReducers(action, scope._state.instructorTypeCosts);
				newState.instructorCosts = scope._instructorCostReducers(action, scope._state.instructorCosts);
				newState.sectionGroupCosts = scope._sectionGroupCostReducers(action, scope._state.sectionGroupCosts);
				newState.sectionGroupCostInstructors = scope._sectionGroupCostInstructorReducers(action, scope._state.sectionGroupCostInstructors);
				newState.users = scope._userReducers(action, scope._state.users);
				newState.userRoles = scope._userRoleReducers(action, scope._state.userRoles);
				newState.userWorkgroupsScenarios = scope._userWorkgroupsScenariosReducers(action, scope._state.userWorkgroupsScenarios);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.calculations = scope._calculationReducers(action, scope._state.calculations);
				newState.ui = scope._uiReducers(action, scope._state.ui);

				scope._state = newState;
				$rootScope.$emit('budgetComparisonReportStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};
	}
}

BudgetComparisonReportReducers.$inject = ['$rootScope', 'ActionTypes'];

export default BudgetComparisonReportReducers;
