/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
budgetApp.service('budgetSelectors', function () {
	return {
		generateBudgetScenarios: function (budgetScenarios) {
			
			budgetScenarioList = [];

			budgetScenarios.ids.forEach( function (budgetScenarioId) {
				budgetScenarioList.push(budgetScenarios.list[budgetScenarioId]);
			});

			return budgetScenarioList;
		},
		generateActiveScenario: function (budgetScenarios) {
			if (budgetScenarios.ids && budgetScenarios.ids.length != 0) {
				return budgetScenarios.list[budgetScenarios.ids[0]];
			}

			return null;
		}
	};
});
