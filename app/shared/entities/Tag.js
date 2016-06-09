angular.module('tag', [])

.factory('Tag', ['$http', function($http) {
	function Tag(tagData) {
		if (tagData) {
			this.setData(tagData);
		}
	};
	Tag.prototype = {
			setData: function(tagData) {
				angular.extend(this, tagData);
			}
	};
	return Tag;
}]);
