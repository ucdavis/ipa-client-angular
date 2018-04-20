const Schedule = angular.module('Schedule', [])
.factory('Schedule', ['$http', function($http) {
	function Schedule(scheduleData) {
		if (scheduleData) {
			this.setData(scheduleData);
		}
	}
	Schedule.prototype = {
			setData: function(scheduleData) {
				angular.extend(this, scheduleData);
			}
	};
	return Schedule;
}]);

export default Schedule;