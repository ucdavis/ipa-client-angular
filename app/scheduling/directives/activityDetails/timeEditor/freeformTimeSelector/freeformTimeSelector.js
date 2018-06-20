import './freeformTimeSelector.css';

let freeformTimeSelector = function (SchedulingActionCreators) {
	return {
		restrict: "E",
		template: require('./freeformTimeSelector.html'),
		scope: {
			activity: '='
		},
		link: function (scope, element, attrs) {
			scope.days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];

			// Ensure activity startTime precedes endTime before submission
			scope.saveActivity = function() {
				var startTime = moment(scope.activity.startTime, "HH:mm");
				var endTime = moment(scope.activity.endTime, "HH:mm");

				if (startTime.isAfter(endTime) || startTime.isSame(endTime)) {
					endTime = startTime.add(5, "minutes");
					scope.activity.endTime = endTime.format("HH:mm");
				}

				SchedulingActionCreators.updateActivity(scope.activity);
			};

			scope.toggleActivityDay = function (index) {
				var dayArr = activity.dayIndicator.split('');
				dayArr[index] = Math.abs(1 - parseInt(dayArr[index])).toString();
				activity.dayIndicator = dayArr.join('');
				scope.saveActivity();
			};
		}
	};
};

export default freeformTimeSelector;
