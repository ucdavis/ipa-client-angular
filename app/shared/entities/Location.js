angular.module('location', [])

.factory('Location', ['$http', function($http) {
	function Location(locationData) {
		if (locationData) {
			this.setData(locationData);
		}
	}
	Location.prototype = {
			setData: function(locationData) {
				angular.extend(this, locationData);
			}
	};
	return Location;
}]);
