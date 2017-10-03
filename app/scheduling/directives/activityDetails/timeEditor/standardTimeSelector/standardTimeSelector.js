sharedApp.directive('standardTimeSelector', function($window, $location, $routeParams, $rootScope, schedulingActionCreators, Activity) {
	return {
		restrict: 'E', // Use this via an element selector <time-pattern-selector></time-pattern-selector>
		templateUrl: 'standardTimeSelector.html', // directive html found here:
		replace: true, // Replace with the template
		scope: {
			activity: '='
		},
		link: function (scope, element, attrs) {
			console.log(scope.activity);
			console.log("taco");

			scope.standardPatterns = Activity.prototype.getStandardTimes();
			scope.timeOfferings = [];
			scope.dayOfferings = [];

			scope.selectedDuration = scope.activity.selectedDuration;
			scope.selectedDayPattern = scope.activity.dayIndicator;
			scope.selectedStartTime = scope.activity.startTime;
			scope.selectedEndTime = scope.activity.endTime;

			if (scope.selectedDuration && scope.selectedDuration > 0) {
				scope.dayOfferings = scope.standardPatterns[scope.selectedDuration].dayIndicators;
				scope.timeOfferings = scope.standardPatterns[scope.selectedDuration].times;
			}

			scope.clearAll = function() {
				scope.selectedDuration = null;

				scope.setTimeToBlank();
				scope.setDaysToBlank();

				scope.timeOfferings = [];
				scope.dayOfferings = [];

				schedulingActionCreators.updateActivity(scope.activity);
			};

			scope.clearTimeAndDay = function() {
				scope.setTimeToBlank();
				scope.setDaysToBlank();
				schedulingActionCreators.updateActivity(scope.activity);
			};

			scope.clearTime = function() {
				scope.setTimeToBlank();
				schedulingActionCreators.updateActivity(scope.activity);
			};

			scope.setDaysToBlank = function() {
				scope.activity.dayIndicator = "0000000";
				scope.selectedDayPattern = null;
			};

			scope.setTimeToBlank = function() {
				scope.activity.startTime = null;
				scope.activity.endTime = null;
				scope.selectedStartTime = null;
				scope.selectedEndTime = null;
			};

			scope.selectDuration = function(duration) {
				scope.selectedDuration = duration;
				scope.activity.selectedDuration = duration;

				scope.clearTimeAndDay();

				scope.dayOfferings = scope.standardPatterns[duration].dayIndicators;
				scope.timeOfferings = scope.standardPatterns[duration].times;
			};

			scope.selectDays = function(days) {
				scope.selectedDayPattern = days;
				scope.activity.dayIndicator = days;
				scope.saveActivity();
			};

			scope.selectTime = function(time) {
				scope.selectedStartTime = time ? time.start : null;
				scope.selectedEndTime = time ? time.end : null;

				scope.activity.frequency = 1;
				scope.activity.startTime = time ? time.start : null;
				scope.activity.endTime = time ? time.end : null;
				scope.saveActivity();
			};

			scope.saveActivity = function () {
				if (scope.activity.dayIndicator && scope.activity.startTime && scope.activity.endTime) {
					schedulingActionCreators.updateActivity(scope.activity);
				}
			};

			// Styling functions
			scope.getWeekDays = function(dayIndicator) {
				return dayIndicator.getWeekDays();
			};

			scope.getMeridianTime = function (time) {
				if (!time) {
					return "";
				}

				time = Activity.prototype.getMeridianTime(time);
				return ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + time.meridian;
			};
		} // End Link
	};
});