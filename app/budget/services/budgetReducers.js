budgetApp.service('budgetReducers', function ($rootScope, $log) {
	return {
		_state: {},
		budgetScenarioReducers: function (action, budgetScenarios) {
		},
		lineItemReducers: function (action, budgetScenarios) {
		},
		reduce: function (action) {
			var scope = this;

			newState = {};
			newState.budget = action.payload.budget;
			newState.lineItems = action.payload.lineItems;
			newState.budgetScenarios = action.payload.budgetScenarios;
			newState.sectionGroupCosts = action.payload.sectionGroupCosts;

			scope._state = newState;

			// Build new 'page state'
			// This is the 'view friendly' version of the store
			newPageState = angular.copy(scope._state);
			newPageState.activeScenario = newState.budgetScenarios[0];

			$rootScope.$emit('budgetStateChanged', newPageState);
		}
	};
});