const CourseOffering = angular.module('CourseOffering', [])

.factory('CourseOffering', ['$http', function($http) {
	function CourseOffering(courseOfferingData) {
		if (courseOfferingData) {
			this.setData(courseOfferingData);
		}
	}
	CourseOffering.prototype = {
			setData: function(courseOfferingData) {
				angular.extend(this, courseOfferingData); // eslint-disable-line no-undef
			}
	};
	return CourseOffering;
}]);

export default CourseOffering;