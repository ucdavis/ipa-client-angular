budgetApp.directive("courseCosts", this.courseCosts = function ($rootScope, budgetActions) {
	return {
		restrict: 'E',
		templateUrl: 'courseCosts.html',
		replace: true,
		scope: {
			selectedBudgetScenario: '<',
			instructors: '<',
			termNav: '<',
			calculatedSectionGroups: '<'
		},
		link: function (scope, element, attrs) {
			scope.setActiveTerm = function(activeTermTab) {
				budgetActions.selectTerm(activeTermTab);
			};

			scope.overrideSectionGroup = function(sectionGroup, property) {
				budgetActions.overrideSectionGroup(sectionGroup, property);
			};

			// Reverts the specified override value
			scope.revertOverride = function(sectionGroupCost, property) {
				// TODO
			};

			scope.toCurrency = function (value) {
				return toCurrency(value);
			};
		} // end link
	};
});
