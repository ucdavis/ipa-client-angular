import './gridAvailable.css';

let gridAvailable = function (StudentFormActions, $timeout) {
	return {
		restrict: 'E',
		template: require('./gridAvailable.html'),
		replace: true,
		scope: {
			supportCallResponse: '<',
			readOnly: '<'
		},
		link: function (scope) {
			scope.saveSupportCallResponse = function(newBlob, delay) {
				scope.supportCallResponse.availabilityBlob = newBlob;

				// Report changes back to server after some delay
				$timeout.cancel(scope.timeout);
				scope.timeout = $timeout(function() {
					StudentFormActions.updateAvailability(scope.supportCallResponse);
				}, delay);
			};

			scope.timeout = {};
		}
	};
};

export default gridAvailable;
