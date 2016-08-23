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
		},
		isSeries: function () {
			return this.sequencePattern.toLowerCase() != this.sequencePattern.toUpperCase();
		}
	};
	return Course;
}]);
