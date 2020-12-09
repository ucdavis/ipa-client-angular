class BudgetService {
	constructor (ApiService) {
		return {
			// Page load
			getInitialState: function(workgroupId, year) {
				return ApiService.get("/api/budgetView/workgroups/" + workgroupId + "/years/" + year);
			},

			// Excel download
			downloadWorkgroupScenariosExcel: function(workgroupScenarios) {
				return ApiService.postWithResponseType("/api/budgetView/downloadExcel", workgroupScenarios, '', 'arraybuffer');
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
				return ApiService.post("/api/budgetView/budgets/" + budgetId + "/budgetScenarios?scenarioId=" + scenarioId + "&copyFunds=" + newBudgetScenario.copyFunds, newBudgetScenario);
			},
			deleteBudgetScenario: function(budgetScenarioId) {
				return ApiService.delete("/api/budgetView/budgetScenarios/" + budgetScenarioId);
			},
			updateBudgetScenario: function(budgetScenario) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id, budgetScenario);
			},
			createBudgetRequestScenario: function(selectedBudgetScenario) {
				return ApiService.post("/api/budgetView/budgets/" + selectedBudgetScenario.budgetId + "/budgetScenarios/" + selectedBudgetScenario.id + "/budgetRequest");
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
				return ApiService.post("/api/budgetView/budgetScenarios/" + sectionGroupCost.budgetScenarioId + "/sectionGroupCosts", sectionGroupCost);
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

			searchCourses: function (query) {
				return ApiService.get("/courses/search?q=" + query + "&token=" + window.dwToken, null, window.dwUrl);
			},

			// SectionGroupCostInstructors
			createSectionGroupCostInstructors: function(sectionGroupCostId, SectionGroupCostInstructor) {
				return ApiService.post("/api/budgetView/sectionGroupCosts/" + sectionGroupCostId + "/sectionGroupCostInstructors", SectionGroupCostInstructor);
			},

			updateSectionGroupCostInstructor: function(sectionGroupCostId, sectionGroupCostInstructor) {
				return ApiService.put("/api/budgetView/sectionGroupCosts/" + sectionGroupCostId + "/sectionGroupCostInstructors/" + sectionGroupCostInstructor.id, sectionGroupCostInstructor);
			},

			deleteSectionGroupCostInstructor: function(sectionGroupCostInstructor) {
				return ApiService.delete("/api/budgetView/sectionGroupCosts/" + sectionGroupCostInstructor.sectionGroupCostId + "/sectionGroupCostInstructors/" + sectionGroupCostInstructor.id);
			},
			// Expense Items
			createExpenseItem: function(newExpenseItem, budgetScenarioId) {
				return ApiService.post("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/expenseItems", newExpenseItem);
			},
			updateExpenseItem: function(expenseItem, budgetScenarioId) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenarioId + "/expenseItems/" + expenseItem.id, expenseItem);
			},
			deleteExpenseItem: function(expenseItem) {
				return ApiService.delete("/api/budgetView/expenseItems/" + expenseItem.id);
			},
			deleteExpenseItems: function(budgetScenario, expenseItemIds) {
				return ApiService.put("/api/budgetView/budgetScenarios/" + budgetScenario.id + "/expenseItems", expenseItemIds);
			},

			getAuditLogs: function(workgroupId) {
				return ApiService.get("/api/workgroups/" + workgroupId + "/modules/Budget" + "/auditLogs");
			}
		};
	}
}

BudgetService.$inject = ['ApiService'];

export default BudgetService;
