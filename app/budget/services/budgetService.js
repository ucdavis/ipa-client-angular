budgetApp.factory("budgetService", this.budgetService = function(apiService) {
	return {
		// Page load
		getInitialState: function(workgroupId, year) {
			return apiService.get("/api/budgetView/workgroups/" + workgroupId + "/years/" + year);
		},

		// Line Items
		createLineItem: function(newLineItem, budgetScenarioId) {
			return apiService.post("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems", newLineItem);
		},
		updateLineItem: function(lineItem, budgetScenarioId) {
			return apiService.put("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems/" + lineItem.id, lineItem);
		},
		deleteLineItem: function(lineItem) {
			return apiService.delete("/api/budgetView/lineItems/" + lineItem.id);
		},
		deleteLineItems: function(budgetScenario, lineItemIds) {
			return apiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id + "/lineItems", lineItemIds);
		},

		// Instructor Types
		updateInstructorTypeCost: function(instructorTypeCost) {
			return apiService.put("/api/budgetView/instructorTypeCosts/" + instructorTypeCost.id, instructorTypeCost);
		},
		createInstructorTypeCost: function(instructorTypeCost) {
			return apiService.post("/api/budgetView/budgets/" + instructorTypeCost.budgetId + "/instructorTypeCosts", instructorTypeCost);
		},
		// Budget Scenario
		createBudgetScenario: function(newBudgetScenario, budgetId, scenarioId) {
			return apiService.post("/api/budgetView/budgets/" + budgetId + "/budgetScenarios?scenarioId=" + scenarioId, newBudgetScenario);
		},
		deleteBudgetScenario: function(budgetScenarioId) {
			return apiService.delete("/api/budgetView/budgetScenarios/" + budgetScenarioId);
		},
		updateBudgetScenario: function(budgetScenario) {
			return apiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id, budgetScenario);
		},

		// Budget
		updateBudget: function(budget) {
			return apiService.put("/api/budgetView/budgets/" + budget.id, budget);
		},

		// SectionGroupCost
		updateSectionGroupCost: function(sectionGroupCost) {
			return apiService.put("/api/budgetView/sectionGroupCosts/" + sectionGroupCost.id, sectionGroupCost);
		},
		createSectionGroupCost: function (sectionGroupCost) {
			return apiService.post("/api/budgetView/budgetScenarios/" + sectionGroupCost.budgetScenarioId + "/sectionGroupCosts", sectionGroupCost);
		},

		// InstructorCost
		updateInstructorCost: function(instructorCost) {
			return apiService.put("/api/budgetView/instructorCosts/" + instructorCost.id, instructorCost);
		},
		createInstructorCost: function(instructorCost) {
			return apiService.put("/api/budgetView/budgets/" + instructorCost.budgetId + "/instructorCosts", instructorCost);
		},

		// SectionGroupCostComment
		createSectionGroupCostComment: function(sectionGroupCostComment) {
			return apiService.post("/api/budgetView/sectionGroupCosts/" + sectionGroupCostComment.sectionGroupCostId + "/sectionGroupCostComments", sectionGroupCostComment);
		},

		// LineItemComment
		createLineItemComment: function(lineItemComment) {
			return apiService.post("/api/budgetView/lineItems/" + lineItemComment.lineItemId + "/lineItemComments", lineItemComment);
		},
	};
});
