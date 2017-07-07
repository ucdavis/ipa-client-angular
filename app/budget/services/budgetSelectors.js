/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
budgetApp.service('budgetSelectors', function () {
	return {
		// Generate list of budget scenarios to display in the dropdown selector
		generateBudgetScenarios: function (budgetScenarios) {
			
			budgetScenarioList = [];

			budgetScenarios.ids.forEach( function (budgetScenarioId) {
				budgetScenarioList.push(budgetScenarios.list[budgetScenarioId]);
			});

			return budgetScenarioList;
		},
		// This object will be the 'meat' of the main view.
		generateActiveScenario: function (budgetScenarios, lineItems, ui, lineItemCategories) {

			var activeBudgetScenario = null;
			// TODO: Make active budget scenario a localStorage value, and affected by UI dropdown
			if (budgetScenarios.ids && budgetScenarios.ids.length != 0) {
				activeBudgetScenario = budgetScenarios.list[budgetScenarios.ids[0]];
			}

			// Set main view UI states
			activeBudgetScenario.isLineItemOpen = ui.isLineItemOpen;
			activeBudgetScenario.isCourseCostOpen = ui.isCourseCostOpen;

			// Add lineItems
			activeBudgetScenario.lineItems = [];

			lineItems.ids.forEach( function (lineItemId) {
				var lineItem = lineItems.list[lineItemId];

				// Add lineItemCategory description
				var lineItemCategoryDescription = lineItemCategories.list[lineItem.lineItemCategoryId].description;
				lineItem.lineItemCategoryDescription = lineItemCategoryDescription;

				// Setting UI state for line item detail view
				lineItem.isDetailViewOpen = false;

				activeBudgetScenario.lineItems.push(lineItem);
				if (ui.openLineItems.indexOf(lineItem.id) > -1) {
					lineItem.isDetailViewOpen = true;
				}
			});

			return activeBudgetScenario;
		}
	};
});
