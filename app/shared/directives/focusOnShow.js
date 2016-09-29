sharedApp.directive("focusOnShow", this.focusOnShow = function ($timeout) {
	return function (scope, element, attrs) {
		// Case 1: using ng-if
		$timeout(function () {
			element.focus();
		});

		// Case 2: using ng-show
		scope.$watch(attrs.ngShow, function (newValue) {
			$timeout(function () {
				if (newValue) { element.focus(); }
			});
		}, true);
	};
});