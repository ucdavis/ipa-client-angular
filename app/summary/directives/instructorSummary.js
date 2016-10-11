summaryApp.directive("instructorSummary", this.instructorSummary = function () {
	return {
		restrict: 'E',
		templateUrl: 'instructorSummary.html',
		replace: true,
		link: function (scope, element, attrs) {
			// Will translate a dayIndicator like '0010100' into 'TR'
			scope.dayIndicatorToDayCodes = function (dayIndicator) {
				dayCodes = "";
				// Handle incorrect data
				if (dayIndicator.length === 0) {
					return dayCodes;
				}
				dayStrings = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
				for (var i = 0; i < dayIndicator.length; i++) {
					char = dayIndicator.charAt(i);
					if (Number(char) == 1) {
						dayCodes += dayStrings[i];
					}
				}

				return dayCodes;
			};

		}
	};
});