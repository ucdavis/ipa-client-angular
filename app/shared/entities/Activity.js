angular.module('activity', [])

.factory('Activity', ['$http', function($http) {
	function Activity(activityData) {
		if (activityData) {
			this.setData(activityData);
		}
	};
	Activity.prototype = {
			setData: function(activityData) {
				angular.extend(this, activityData);
			}
	};
	return Activity;
}]);
