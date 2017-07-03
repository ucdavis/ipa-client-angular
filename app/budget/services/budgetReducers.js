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
		scheduleBudgetReducers: function (action, budget) {
			switch (action.type) {
				case INIT_STATE:
					budget = action.payload.budget;
					return budget;
				default:
					return budget;
			}
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.budget = scope.scheduleBudgetReducers(action, scope._state.budget);
			newState.budgetScenarios = scope.budgetScenarioReducers(action, scope._state.budgetScenarios);
			newState.lineItems = action.payload.lineItems;
			newState.sectionGroupCosts = action.payload.sectionGroupCosts;

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = {};
			newPageState.activeScenario = budgetSelectors.generateActiveScenario(newState.budgetScenarios);
			newPageState.budgetScenarios = budgetSelectors.generateBudgetScenarios(newState.budgetScenarios);
			newPageState.budget = newState.budget;

			$rootScope.$emit('budgetStateChanged', newPageState);
			console.log(newPageState);
		}
	};
});