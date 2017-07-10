budgetApp.service('budgetReducers', function ($rootScope, $log, budgetSelectors) {
	return {
		_state: {},
		budgetScenarioReducers: function (action, budgetScenarios) {
			var scope = this;

			switch (action.type) {
				case INIT_STATE:
					budgetScenarios = {
						ids: [],
						list: {}
					};

					action.payload.budgetScenarios.forEach( function(budgetScenario) {
						budgetScenarios.ids.push(budgetScenario.id);
						budgetScenarios.list[budgetScenario.id] = budgetScenario;
					});
					return budgetScenarios;
				case CREATE_BUDGET_SCENARIO:
					var newBudgetScenario = action.payload;
					budgetScenarios.ids.push(newBudgetScenario.id);
					budgetScenarios.list[newBudgetScenario.id] = newBudgetScenario;
					return budgetScenarios;
				case DELETE_BUDGET_SCENARIO:
					var budgetScenarioId = action.payload.budgetScenarioId;
					var index = budgetScenarios.ids.indexOf(budgetScenarioId);
					budgetScenarios.ids.splice(index, 1);
					delete budgetScenarios.list[budgetScenarioId];
					return budgetScenarios;
				default:
					return budgetScenarios;
			}
		},
		lineItemReducers: function (action, lineItems) {
			switch (action.type) {
				case INIT_STATE:
					lineItems = {
						ids: [],
						list: {}
					};
					action.payload.lineItems.forEach( function( lineItem) {
						lineItems.ids.push(lineItem.id);
						lineItems.list[lineItem.id] = lineItem;
					});
					return lineItems;

				case CREATE_LINE_ITEM:
					var newLineItem = action.payload;
					lineItems.ids.push(newLineItem.id);
					lineItems.list[newLineItem.id] = newLineItem;
					return lineItems;
				case DELETE_LINE_ITEM:
					var lineItemId = action.payload.lineItemId;
					var index = lineItems.ids.indexOf(lineItemId);
					lineItems.ids.splice(index, 1);
					delete lineItems.list[lineItemId];
					return lineItems;
				default:
					return lineItems;
			}
		},
		scheduleBudgetReducers: function (action, budget) {
			switch (action.type) {
				case INIT_STATE:
					budget = action.payload.budget;
					return budget;
				default:
					return budget;
			}
		},
		lineItemCategoryReducers: function (action, lineItemCategories) {
			switch (action.type) {
				case INIT_STATE:
					lineItemCategories = {
						ids: [],
						list: []
					};

					action.payload.lineItemCategories.forEach( function(lineItemCategory) {
						lineItemCategories.ids.push(lineItemCategory.id);
						lineItemCategories.list[lineItemCategory.id] = lineItemCategory;
					});
					return lineItemCategories;
				default:
					return lineItemCategories;
			}
		},
		uiReducers: function (action, ui) {
			switch (action.type) {
				case INIT_STATE:
					ui = {
						isLineItemOpen: false,
						isCourseCostOpen: false,
						openLineItems: []
					};
					return ui;
				case TOGGLE_LINE_ITEM_SECTION:
					ui.isLineItemOpen = !(ui.isLineItemOpen);
					return ui;
				case TOGGLE_COURSE_COST_SECTION:
					ui.isCourseCostOpen = !(ui.isCourseCostOpen);
					return ui;
				case TOGGLE_LINE_ITEM:
					var lineItemId = action.payload.lineItemId;
					var index = ui.openLineItems.indexOf(lineItemId);
					if (index == -1) {
						ui.openLineItems.push(lineItemId);
					} else {
						ui.openLineItems.splice(index, 1);
					}
					return ui;
				default:
					return ui;
			}
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.budget = scope.scheduleBudgetReducers(action, scope._state.budget);
			newState.budgetScenarios = scope.budgetScenarioReducers(action, scope._state.budgetScenarios);
			newState.lineItems = scope.lineItemReducers(action, scope._state.lineItems);
			newState.lineItemCategories = scope.lineItemCategoryReducers(action, scope._state.lineItemCategories);
			newState.sectionGroupCosts = action.payload.sectionGroupCosts;
			newState.ui = scope.uiReducers(action, scope._state.ui);
			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.activeBudgetScenario = budgetSelectors.generateActiveScenario(newState.budgetScenarios, newState.lineItems, newState.ui, newState.lineItemCategories);
			newPageState.budgetScenarios = budgetSelectors.generateBudgetScenarios(newState.budgetScenarios);
			newPageState.budget = newState.budget;
			newPageState.ui = newState.ui;
			newPageState.lineItemCategories = budgetSelectors.generateLineItemCategories(newState.lineItemCategories);

			$rootScope.$emit('budgetStateChanged', newPageState);
			console.log(newPageState);
		}
	};
});