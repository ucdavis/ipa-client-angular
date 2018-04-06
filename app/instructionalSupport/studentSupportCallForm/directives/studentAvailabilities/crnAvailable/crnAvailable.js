instructionalSupportApp.directive("crnAvailable", this.crnAvailable = function (studentActions) {
	return {
		restrict: 'E',
		templateUrl: 'crnAvailable.html',
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.searchCrn = "";

			scope.calculateTimesForCrn = function(crn) {
				studentActions.fetchTimesByCrn(crn);
			};

			scope.updateAvailability = function() {
				studentActions.applyCrnToAvailability();
			};

			scope.clearCrnSearch = function() {
				studentActions.clearCrnSearch();
				scope.searchCrn = "";
			};

			scope.clearAvailability = function() {
				studentActions.clearAvailability();
			};
		}
	};
});
