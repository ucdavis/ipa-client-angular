let timeEditor = function (ActivityService, Activity) {
	return {
		restrict: "E",
		template: require('./timeEditor.html'),
		link: function (scope, element, attrs) {
			scope.dayIndicatorToDayCodes = function (dayIndicator) {
				return ActivityService.dayIndicatorToDayCodes(dayIndicator);
			};

			scope.isBannerApprovedTimePattern = function (activity) {
				var standardPatterns = Activity.prototype.getStandardTimes();

				if (!activity || !activity.selectedDuration || !standardPatterns[activity.selectedDuration]) { return false; }

				var isDurationApproved = !!standardPatterns[activity.selectedDuration];
				var isDayPatternApproved = standardPatterns[activity.selectedDuration].dayIndicators.indexOf(activity.dayIndicator) > -1;
				var isTimeBannerApproved = scope.isTimeBannerApproved(activity);

				if (!isDurationApproved || !isDayPatternApproved || !isTimeBannerApproved) {
					return false;
				}

				return true;
			};

			scope.isTimeBannerApproved = function (activity) {
				var standardPatterns = Activity.prototype.getStandardTimes();
				var isTimeBannerApproved = false;

				standardPatterns[activity.selectedDuration].times.forEach(function(time) {
					if (activity.startTime == time.start && activity.endTime == time.end) {
						isTimeBannerApproved = true;
					}
				});
			
				return isTimeBannerApproved;
			};
		}
	};
};

export default timeEditor;
