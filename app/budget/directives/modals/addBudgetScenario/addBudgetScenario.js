import './addBudgetScenario.css';
import { dateToCalendar } from '../../../../shared/helpers/dates';

let addBudgetScenario = function ($rootScope, BudgetActions) {
  return {
    restrict: 'E',
    template: require('./addBudgetScenario.html'),
    replace: true,
    scope: {
      state: '<',
      isVisible: '='
    },
    link: function (scope, element, attrs) {
      scope.newBudgetScenario = {};
      scope.newBudgetScenario.name = "";
      scope.newBudgetScenario.budgetScenarioId = 0;
      scope.newBudgetScenario.description = "Schedule Data (No Costs/Funds)";
      scope.newBudgetScenario.copyFunds = true;

      scope.budgetId = attrs.budgetId;

      scope.selectBudgetScenario = function(budgetScenario) {
        if (budgetScenario == null) {
          scope.newBudgetScenario.budgetScenarioId = 0;
          scope.newBudgetScenario.description = "Schedule Data (No Costs/Funds)";
        } else {
          scope.newBudgetScenario.budgetScenarioId = budgetScenario.id;
          scope.newBudgetScenario.description = budgetScenario.isSnapshot ? budgetScenario.name + " - SNAPSHOT - " + dateToCalendar(budgetScenario.creationDate) : budgetScenario.name;
        }
      };

      scope.submitBudgetScenarioForm = function () {
        BudgetActions.createBudgetScenario(scope.newBudgetScenario, scope.state.budget.id, scope.newBudgetScenario.budgetScenarioId);
        scope.close();
      };

      scope.toggleCopyFunds = function () {
        scope.newBudgetScenario.copyFunds = !scope.newBudgetScenario.copyFunds;
      };

      scope.dateToCalendar = function (date) {
        return dateToCalendar(date);
      };

      scope.close = function() {
        scope.isVisible = false;
      };
    }
  };
};

export default addBudgetScenario;
