import './timeInput.css';

/**
 * example:
 * <time-input	time="time"
 * 				minute-step="5"
 *				on-change-delay="500"
 *				on-change="saveChanges()"
 * 				link-minute-hour="true"></time-input>
 */
let timeInput = function ($timeout) {
	return {
		restrict: "E",
		template: require('./timeInput.html'),
		scope: {
			time: '=',
			minuteStep: '@',
			onChangeDelay: '@',
			onChange: '&',
			floor: '=',
			ceiling: '='
		},
		link: function (scope, element, attrs) {
			var linkMinuteHour = (attrs.linkMinuteHour === 'true');
			scope.canDecrementHours = true;
			scope.canDecrementMinutes = true;
			scope.canIncrementHours = true;
			scope.canIncrementMinutes = true;

			scope.updateUI = function() {
				scope.canDecrementHours = true;
				scope.canDecrementMinutes = true;
				scope.canIncrementHours = true;
				scope.canIncrementMinutes = true;

				var selectedTime = moment(scope.time, "HH:mm:ss");
				selectedMinutes = selectedTime.minutes();
				selectedHours = selectedTime.hours();

				if (selectedMinutes == "55") {
					scope.canIncrementMinutes = false;
				}

				if (selectedMinutes == "00") {
					scope.canDecrementMinutes = false;
				}

				if (scope.floor) {
					var floorTime = moment(scope.floor, "HH:mm:ss");
					floorTime = floorTime.add(5, "minutes");

					floorMinutes = floorTime.minutes();
					floorHours = floorTime.hours();


					if (floorHours == selectedHours && floorMinutes == selectedMinutes) {
						scope.canDecrementMinutes = false;
					}

					if (floorHours == selectedHours) {
						scope.canDecrementHours = false;
					}

					if (selectedMinutes < floorMinutes && ((floorHours+1) == selectedHours)) {
						scope.canDecrementHours = false;
					}
				}

				if (scope.ceiling) {
					var ceilingTime = moment(scope.ceiling, "HH:mm:ss");
					ceilingTime = ceilingTime.subtract(5, "minutes");

					ceilingMinutes = ceilingTime.minutes();
					ceilingHours = ceilingTime.hours();

					if (ceilingHours == selectedHours && ceilingMinutes == selectedMinutes) {
						scope.canIncrementMinutes = false;
					}

					if ( ceilingHours == selectedHours) {
						scope.canIncrementHours = false;
					}
				}
			};

			scope.updateUI();

			scope.getMeridianTime = function () {
				if (!scope.time) {
					return { hours: '--', minutes: '--', meridian: '--' };
				}

				var timeArr = scope.time.split(':');

				var hours = parseInt(timeArr[0]);
				if (hours === 0) { hours = 12; }
				else if (hours > 12) { hours = hours % 12; }

				var minutes = parseInt(timeArr[1]);
				var meridian = timeArr[0] < 12 ? 'AM' : 'PM';

				return { hours: hours, minutes: minutes, meridian: meridian };
			};

			scope.incrementHours = function () {
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

			scope.decrementHours = function () {
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

			scope.incrementMinutes = function () {
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

			scope.decrementMinutes = function () {
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

			scope.toggleMeridian = function () {
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

			scope.updateTime = function (time) {
				$timeout.cancel(scope.timer);
				if (time.meridian === 'PM' && time.hours !== 12) { time.hours = time.hours + 12; }
				else if (time.meridian === 'AM' && time.hours === 12) { time.hours = 0; }

				scope.time = ('0' + time.hours).slice(-2) + ':' + ('0' + time.minutes).slice(-2) + ":00";

				scope.timer = $timeout(function () {
					scope.onChange();
				}, parseInt(scope.onChangeDelay));

				scope.updateUI();
			};
		}
	};
};

export default timeInput;