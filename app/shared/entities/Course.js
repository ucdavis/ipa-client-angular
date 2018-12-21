const Course = angular.module('Course', [])

.factory('Course', ['$http', function($http) {
	function Course(courseData) {
		this.tagIds = [];
		if (courseData) {
			this.setData(courseData);
		}
	}
	Course.prototype = {
		setData: function(courseData) {
			angular.extend(this, courseData); // eslint-disable-line no-undef
		},
		isSeries: function () {
			return this.sequencePattern.toLowerCase() != this.sequencePattern.toUpperCase();
		}
	};
	return Course;
}]);

export default Course;