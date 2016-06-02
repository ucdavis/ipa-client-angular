angular.module('section', [])

.factory('Section', ['$http', function($http) {
	function Section(sectionData) {
		if (sectionData) {
			this.setData(sectionData);
		}
	};
	Section.prototype = {
			setData: function(sectionData) {
				angular.extend(this, sectionData);
			}
	};
	return Section;
}]);
