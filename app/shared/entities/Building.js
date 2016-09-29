angular.module('building', [])

.factory('Building', ['$http', function($http) {
	function Building(buildingData) {
		if (buildingData) {
			this.setData(buildingData);
		}
	}
	Building.prototype = {
			setData: function(buildingData) {
				angular.extend(this, buildingData);
			}
	};
	return Building;
}]);
