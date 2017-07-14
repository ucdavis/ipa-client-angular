budgetApp.directive("termSelector", this.termSelector = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'termSelector.html',
		replace: true,
		scope: {
			terms: '<',
			termDescriptions: '<',
			selectedTerm: '<'
		},
		link: function (scope, element, attrs) {
			scope.selectTerm = function(term) {
				budgetActions.selectTerm(term);
			};
		} // end link
	};
});
