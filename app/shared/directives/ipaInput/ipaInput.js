sharedApp.directive("ipaInput", this.ipaInput = function () {
	return {
		restrict: 'E',
		templateUrl: 'ipaInput.html',
		replace: true,
		scope: {
			onUpdate: '&?',
			value: '=',
			readOnly: '=?',
			placeHolder: '<?'
		},
		link: function(scope, element, attrs) {
			element.unbind("keydown keyup");

			element.bind("keydown keyup", function (event) {
				if (angular.isUndefined(scope.onUpdate)) { return; }

				clearTimeout(scope.timeout);
				scope.timeout = setTimeout(scope.onUpdate, 500, null, true);
			});
		}
	};
});