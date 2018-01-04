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
					message: "ipaRadio: Required method onSelect was not provided."
				};
			}

			scope.triggerSelection = function(radio) {
				scope.onSelect()(radio);
			};
		}
	};
});