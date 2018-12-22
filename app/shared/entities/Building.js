const Building = angular.module('Building', []) // eslint-disable-line no-undef

.factory('Building', function() {
	function Building(buildingData) {
		if (buildingData) {
			this.setData(buildingData);
		}
	}
	Building.prototype = {
			setData: function(buildingData) {
				angular.extend(this, buildingData); // eslint-disable-line no-undef
			}
	};
	return Building;
});

export default Building;
