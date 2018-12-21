 // eslint-disable-next-line no-undef
const Schedule = angular.module('Schedule', [])
.factory('Schedule', ['$http', function($http) {
	function Schedule(scheduleData) {
		if (scheduleData) {
			this.setData(scheduleData);
		}
	}
	Schedule.prototype = {
			setData: function(scheduleData) {
				angular.extend(this, scheduleData); // eslint-disable-line no-undef
			}
	};
	return Schedule;
}]);

export default Schedule;