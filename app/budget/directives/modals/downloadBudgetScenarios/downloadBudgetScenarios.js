import { dateToCalendar, dateToRelative } from 'shared/helpers/dates';

import './downloadBudgetScenarios.css';

let downloadBudgetScenarios = function ($rootScope, BudgetActions) {
	return {
		restrict: 'E',
		template: require('./downloadBudgetScenarios.html'),
		replace: true,
		scope: {
			budgetScenarios: '<',
			isOpen: '=',
			isVisible: '='
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

			scope.toggleExclude = function(department) {
				department.exclude = (department.exclude ? false : true);
			};

			scope.close = function() {
				console.log("closing");
				scope.isOpen = false;
				scope.isVisible = false;
			};

			scope.submit = function() {
				console.log("Submitting");
				let scenarioIds = [];
				for (var department in scope.budgetScenariosAccessible){
					if (!department.exclude){
						if (department.selectBudgetScenario){
							scenarioIds.push(department.selectBudgetScenario.id);
						} else {
							let liveData = department.budgetScenarios.find(s => s.name === 'Live Data');
							if (liveData){
								scenarioIds.push(liveData.id);
							}
						}
					}
				}
				console.log('Sending the following list ', scenarioIds);
			};
		} // end link
	};
};

export default downloadBudgetScenarios;
