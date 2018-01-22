budgetApp.directive("generalConfig", this.generalConfig = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'generalConfig.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			// Intentionally blank
		}
	};
});
