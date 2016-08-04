angular.module('course', [])

.factory('Course', ['$http', function($http) {
	function Course(courseData) {
		this.tagIds = [];
		if (courseData) {
			this.setData(courseData);
		}
	};
	Course.prototype = {
			setData: function(courseData) {
				angular.extend(this, courseData);
			}
	};
	return Course;
}]);
