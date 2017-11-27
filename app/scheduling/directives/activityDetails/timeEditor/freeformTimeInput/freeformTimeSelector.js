schedulingApp.directive("freeformTimeSelector", this.freeformTimeSelector = function (schedulingActionCreators) {
	return {
		restrict: "E",
		templateUrl: 'freeformTimeSelector.html',
		scope: {
			activity: '='
		},
		link: function (scope, element, attrs) {
			// Ensure activity startTime precedes endTime before submission
			scope.saveActivity = function() {
				startTime = moment(scope.activity.startTime, "HH:mm");
				endTime = moment(scope.activity.endTime, "HH:mm");

				if (startTime.isAfter(endTime) || startTime.isSame(endTime)) {
					endTime = startTime.add(5, "minutes");
					scope.activity.endTime = endTime.format("HH:mm");
				}

				schedulingActionCreators.updateActivity(scope.activity);
			};
		}
	};
});
