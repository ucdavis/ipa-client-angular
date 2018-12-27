// eslint-disable-next-line no-undef
const Event = angular.module('Event', [])

.factory('Event', function() {
	function Event(eventData) {
		if (eventData) {
			this.setData(eventData);
		}
	}
	Event.prototype = {
			setData: function(eventData) {
				angular.extend(this, eventData); // eslint-disable-line no-undef
			}
	};
	return Event;
});

export default Event;
