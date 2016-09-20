angular.module('event', [])

.factory('Event', ['$http', function($http) {
	function Event(eventData) {
		if (eventData) {
			this.setData(eventData);
		}
	};
	Event.prototype = {
			setData: function(eventData) {
				angular.extend(this, eventData);
			}
	};
	return Event;
}]);
