sharedApp.directive('budgetScenarioDropdown', function($window, $location, $routeParams, $rootScope, authService) {
	return {
		restrict: 'E', // Use this via an element selector <budget-scenario-dropdown></budget-scenario-dropdown>
		templateUrl: 'budgetScenarioDropdown.html', // directive html found here:
		replace: true, // Replace with the template
		link: function (scope, element, attrs) {

		} // End Link
	};
});