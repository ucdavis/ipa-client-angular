instructionalSupportApp.directive("crnAvailable", this.crnAvailable = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'crnAvailable.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.calculateTimesForCrn = function(crn) {
				studentActions.fetchTimesByCrn(crn);
			};
			// Intentionally empty
		}
	};
});