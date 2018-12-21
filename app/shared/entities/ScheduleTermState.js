 // eslint-disable-next-line no-undef
const ScheduleTermState = angular.module('ScheduleTermState', [])

.factory('ScheduleTermState', ['$http', function($http) {
	function ScheduleTermState(scheduleTermStateData) {
		if (scheduleTermStateData) {
			this.setData(scheduleTermStateData);
		}
	}
	ScheduleTermState.prototype = {
			setData: function(scheduleTermStateData) {
				angular.extend(this, scheduleTermStateData); // eslint-disable-line no-undef
			}
	};
	return ScheduleTermState;
}]);

export default ScheduleTermState;