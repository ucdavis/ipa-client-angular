import './crnAvailable.css';

let crnAvailable = function (StudentFormActions) {
	return {
		restrict: 'E',
		template: require('./crnAvailable.html'),
		replace: true,
		scope: {
			state: '<'
		},
		link: function (scope, element, attrs) {
			scope.searchCrn = "";

			scope.calculateTimesForCrn = function(crn) {
				StudentFormActions.fetchTimesByCrn(crn);
			};

			scope.updateAvailability = function() {
				StudentFormActions.applyCrnToAvailability();
			};

			scope.clearCrnSearch = function() {
				StudentFormActions.clearCrnSearch();
				scope.searchCrn = "";
			};

			scope.clearAvailability = function() {
				StudentFormActions.clearAvailability();
			};
		}
	};
};

export default crnAvailable;
