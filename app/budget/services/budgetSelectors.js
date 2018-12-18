/*
	Selectors are pure javascript functions that translate the normalized state into nested objects for the view
*/
class BudgetSelectors {
  constructor () {
    return {
      // Generate list of budget scenarios to display in the dropdown selector
      generateBudgetScenarios: function (budgetScenarios) {
        let budgetScenarioList = budgetScenarios.ids.map(function(budgetScenarioId) {
          return budgetScenarios.list[budgetScenarioId];
        });

        return budgetScenarioList;
      },
      generateLineItemCategories: function (lineItemCategories) {
        let lineItemCategoryList = [];

        lineItemCategories.ids.forEach( function (lineItemCategoryId) {
          lineItemCategoryList.push(lineItemCategories.list[lineItemCategoryId]);
        });

        return lineItemCategoryList;
      },
      generateSelectedBudgetScenario: function (budgetScenarios, ui) {
        return budgetScenarios.list[ui.selectedBudgetScenarioId];
      }
    };
  }
}

BudgetSelectors.$inject = [];

export default BudgetSelectors;
