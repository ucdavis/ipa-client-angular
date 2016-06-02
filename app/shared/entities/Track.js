angular.module('track', [])

.factory('Track', ['$http', function($http) {
	function Track(trackData) {
		if (trackData) {
			this.setData(trackData);
		}
	};
	Track.prototype = {
			setData: function(trackData) {
				angular.extend(this, trackData);
			}
	};
	return Track;
}]);
