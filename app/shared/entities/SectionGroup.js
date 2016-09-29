angular.module('sectionGroup', [])

.factory('SectionGroup', ['$http', function($http) {
	function SectionGroup(coData) {
		if (coData) {
			this.setData(coData);
		}
	}
	SectionGroup.prototype = {
			setData: function(coData) {
				angular.extend(this, coData);
			}
	};
	return SectionGroup;
}]);
