sharedApp.directive("ipaRadio", this.ipaRadio = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaRadio.html',
		replace: true,
		scope: {
			radioNames: '<',
			activeRadio: '<',
			onSelect: '&'
		},
		link: function (scope, element, attrs) {
			// Validate passed methods
			if (angular.isUndefined(scope.onSelect)) {
				throw {
					message: "ipaTabs: Required method onSelect was not provided."
				};
			}

			scope.triggerSelection = function(tab) {
				scope.onSelect()(tab);
			};
		}
	};
});