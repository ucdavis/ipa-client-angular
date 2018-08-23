class BudgetService {
	constructor (ApiService) {
		return {
			// Page load
			getInitialState: function(workgroupId, year) {
				return ApiService.get("/api/budgetView/workgroups/" + workgroupId + "/years/" + year);
			},
	
			// Line Items
			createLineItem: function(newLineItem, budgetScenarioId) {
				return ApiService.post("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems", newLineItem);
			},
			updateLineItem: function(lineItem, budgetScenarioId) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/lineItems/" + lineItem.id, lineItem);
			},
			deleteLineItem: function(lineItem) {
				return ApiService.delete("/api/budgetView/lineItems/" + lineItem.id);
			},
			deleteLineItems: function(budgetScenario, lineItemIds) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id + "/lineItems", lineItemIds);
			},
	
			// Instructor Types
			updateInstructorTypeCost: function(instructorTypeCost) {
				return ApiService.put("/api/budgetView/instructorTypeCosts/" + instructorTypeCost.id, instructorTypeCost);
			},
			createInstructorTypeCost: function(instructorTypeCost) {
				return ApiService.post("/api/budgetView/budgets/" + instructorTypeCost.budgetId + "/instructorTypeCosts", instructorTypeCost);
			},
			// Budget Scenario
			createBudgetScenario: function(newBudgetScenario, budgetId, scenarioId) {
				return ApiService.post("/api/budgetView/budgets/" + budgetId + "/budgetScenarios?scenarioId=" + scenarioId, newBudgetScenario);
			},
			deleteBudgetScenario: function(budgetScenarioId) {
				return ApiService.delete("/api/budgetView/budgetScenarios/" + budgetScenarioId);
			},
			updateBudgetScenario: function(budgetScenario) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id, budgetScenario);
			},
	
			// Budget
			updateBudget: function(budget) {
				return ApiService.put("/api/budgetView/budgets/" + budget.id, budget);
			},
	
			// SectionGroupCost
			updateSectionGroupCost: function(sectionGroupCost) {
				return ApiService.put("/api/budgetView/sectionGroupCosts/" + sectionGroupCost.id, sectionGroupCost);
			},
			createSectionGroupCost: function (sectionGroupCost) {
				return ApiService.post("/api/budgetView/budgetScenarios/" + sectionGroupCost.budgetScenarioId + "/sectionGroups/" + sectionGroupCost.sectionGroupId + "/sectionGroupCosts");
			},
	
			// InstructorCost
			updateInstructorCost: function(instructorCost) {
				return ApiService.put("/api/budgetView/instructorCosts/" + instructorCost.id, instructorCost);
			},
			createInstructorCost: function(instructorCost) {
				return ApiService.put("/api/budgetView/budgets/" + instructorCost.budgetId + "/instructorCosts", instructorCost);
			},
	
			// SectionGroupCostComment
			createSectionGroupCostComment: function(sectionGroupCostComment) {
				return ApiService.post("/api/budgetView/sectionGroupCosts/" + sectionGroupCostComment.sectionGroupCostId + "/sectionGroupCostComments", sectionGroupCostComment);
			},
	
			// LineItemComment
			createLineItemComment: function(lineItemComment) {
				return ApiService.post("/api/budgetView/lineItems/" + lineItemComment.lineItemId + "/lineItemComments", lineItemComment);
			},
		};
	}
}

BudgetService.$inject = ['ApiService'];

export default BudgetService;
