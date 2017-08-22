sharedApp.directive('budgetScenarioToolbar', function($window, $location, $routeParams, $rootScope, budgetActions) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		templateUrl: 'budgetScenarioToolbar.html', // directive html found here:
		replace: true, // Replace with the template
		scope: {},
		link: function (scope, element, attrs) {
			scope.openSupportCostModal = function() {
				budgetActions.toggleSupportCostModal();
			};
		} // End Link
	};
});