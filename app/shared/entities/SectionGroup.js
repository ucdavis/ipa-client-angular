const SectionGroup = angular.module('SectionGroup', [])

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

export default SectionGroup;