import { dateToCalendar, dateToRelative } from 'shared/helpers/dates';

import './downloadBudgetScenarios.css';

let downloadBudgetScenarios = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./downloadBudgetScenarios.html'),
		replace: true,
		scope: {
			budgetScenarios: '<',
		},
		link: function (scope) {
			scope.newComment = "";
			scope.budgetScenariosAccessible = [{
				id: "DSS",
				budgetScenarios: scope.budgetScenarios
			}];

			scope.isFormValid = function() {
				if (scope.newComment.length > 0) {
					return true;
				}

				return false;
			};

			scope.dateToCalendar = function(date) {
				return dateToCalendar(date);
			};

			scope.dateToRelative = function(date) {
				return dateToRelative(date);
			};

			scope.selectBudgetScenario = function(scenario, department){
				console.log('On click', scenario);
				department.selectBudgetScenario = scenario;
				console.log('Update scope scenarios is ', scope.budgetScenariosAccessible);
			};

			scope.submit = function() {
				BudgetActions.createLineItemComment(scope.newComment, scope.lineItem, scope.currentUserLoginId);
				scope.newComment = "";
			};
		} // end link
	};
};

export default downloadBudgetScenarios;
