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
		generateLineItemCategories: function (lineItemCategories) {
			
			lineItemCategoryList = [];

			lineItemCategories.ids.forEach( function (lineItemCategoryId) {
				lineItemCategoryList.push(lineItemCategories.list[lineItemCategoryId]);
			});

			return lineItemCategoryList;
		},
		generateActiveBudgetScenario: function (budgetScenarios, lineItems, ui, lineItemCategories) {
			var activeBudgetScenario = budgetScenarios.list[ui.activeBudgetScenarioId];

			// ActiveBudgetScenarioId refers to a scenario that no longer exists
			// We will attempt to automatically select another scenario to be 'active'
			if (activeBudgetScenario == null) {
				if (budgetScenarios.ids.length > 0) {
					// Pick the first available
					var budgetScenarioId = budgetScenarios.ids[0];
					activeBudgetScenario = budgetScenarios.list[budgetScenarioId];
				} else {
					// There are no scenarios, so there cannot be an active scenario
					return null;
				}
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
				lineItem.isDetailViewOpen = ui.lineItemDetails[lineItem.id].isDetailViewOpen;
				lineItem.displayTypeInput = ui.lineItemDetails[lineItem.id].displayTypeInput;
				lineItem.displayAmountInput = ui.lineItemDetails[lineItem.id].displayAmountInput;
				lineItem.displayNotesInput = ui.lineItemDetails[lineItem.id].displayNotesInput;
				lineItem.displayDescriptionInput = ui.lineItemDetails[lineItem.id].displayDescriptionInput;

				activeBudgetScenario.lineItems.push(lineItem);
				if (ui.openLineItems.indexOf(lineItem.id) > -1) {
					lineItem.isDetailViewOpen = true;
				}
			});

			return activeBudgetScenario;
		}
	};
});
