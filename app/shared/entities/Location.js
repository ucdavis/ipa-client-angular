 // eslint-disable-next-line no-undef
const Location = angular.module('Location', [])

.factory('Location', ['$http', function($http) {
	function Location(locationData) {
		if (locationData) {
			this.setData(locationData);
		}
	}
	Location.prototype = {
			setData: function(locationData) {
				angular.extend(this, locationData); // eslint-disable-line no-undef
			}
	};
	return Location;
}]);

export default Location;