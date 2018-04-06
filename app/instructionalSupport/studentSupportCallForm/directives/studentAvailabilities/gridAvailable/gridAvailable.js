instructionalSupportApp.directive("gridAvailable", this.gridAvailable = function (studentActions, $timeout) {
	return {
		restrict: 'E',
		templateUrl: 'gridAvailable.html',
		replace: true,
		scope: {
			supportCallResponse: '<',
			readOnly: '<'
		},
		link: function (scope, element, attrs) {

			scope.saveSupportCallResponse = function(newBlob, delay) {
				scope.supportCallResponse.availabilityBlob = newBlob;

				// Report changes back to server after some delay
				$timeout.cancel(scope.timeout);
				scope.timeout = $timeout(function() {
					studentActions.updateAvailability(scope.supportCallResponse);
				}, delay);
			};

			scope.timeout = {};
		}
	};
});
