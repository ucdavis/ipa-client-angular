/**
 * example:
 * <time-input	time="time"
 * 				minute-step="5"
 * 				link-minute-hour="true"></time-input>
 */
sharedApp.directive("timeInput", this.timeInput = function(timePatternService) {
	return {
		restrict: "E",
		templateUrl: 'timeInput.html',
		scope: {
			time: '=',
			minuteStep: '@'
		},
		link: function(scope, element, attrs) {
			var linkMinuteHour = (attrs.linkMinuteHour === 'true');

			scope.getMeridianTime = function() {
				return timePatternService.getMeridianTime(scope.time);
			};

			scope.incrementHours = function() {
				var time = scope.getMeridianTime();

				var hours;
				if (time.hours === '--') {
					hours = 12;
					time.minutes = 0;
					time.meridian = 'PM';
				} else {
					hours = time.hours;
				}

				hours++;
				if (hours === 12) {
					time.hours = hours;
					time.meridian = time.meridian === 'AM' ? 'PM' : 'AM';
				} else if (hours > 12) {
					time.hours = hours % 12;
				} else {
					time.hours = hours;
				}
				scope.updateTime(time);
			};

			scope.decrementHours = function() {
				var time = scope.getMeridianTime();

				var hours;
				if (time.hours === '--') {
					hours = 12;
					time.minutes = 0;
					time.meridian = 'PM';
				} else {
					hours = time.hours;
				}

				hours--;
				if (hours === 0) {
					time.hours = 12;
				} else if (hours === 11) {
					time.hours = hours;
					time.meridian = time.meridian === 'AM' ? 'PM' : 'AM';
				} else {
					time.hours = hours;
				}
				scope.updateTime(time);
			};

			scope.incrementMinutes = function() {
				var time = scope.getMeridianTime();

				var minutes;
				if (time.minutes === '--') {
					minutes = 0;
					time.hours = 12;
					time.meridian = 'PM';
				} else {
					minutes = time.minutes;
				}

				minutes += parseInt(scope.minuteStep);
				if (minutes >= 60) {
					time.minutes = minutes % 60;
					scope.updateTime(time);
					if (linkMinuteHour) { scope.incrementHours(); }
				} else {
					time.minutes = minutes;
					scope.updateTime(time);
				}
			};

			scope.decrementMinutes = function() {
				var time = scope.getMeridianTime();

				var minutes;
				if (time.minutes === '--') {
					minutes = 0;
					time.hours = 12;
					time.meridian = 'PM';
				} else {
					minutes = time.minutes;
				}

				minutes -= parseInt(scope.minuteStep);
				if (minutes < 0) {
					time.minutes = minutes + 60;
					scope.updateTime(time);
					if (linkMinuteHour) { scope.decrementHours(); }
				} else {
					time.minutes = minutes;
					scope.updateTime(time);
				}
			};

			scope.toggleMeridian = function() {
				var time = scope.getMeridianTime();
				if (time.meridian === 'AM') {
					time.meridian = 'PM';
				} else if (time.meridian === 'PM') {
					time.meridian = 'AM';
				} else {
					time.minutes = 0;
					time.hours = 12;
					time.meridian = 'PM';
				}
				scope.updateTime(time);
			};

			scope.updateTime = function(time) {
				if (time.meridian === 'PM' && time.hours !== 12) time.hours = time.hours + 12;
				else if (time.meridian === 'AM' && time.hours === 12) time.hours = 0;

				scope.time = ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + ":00";
			}
		}
	}
});
