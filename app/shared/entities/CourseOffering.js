angular.module('courseOffering', [])

.factory('CourseOffering', ['$http', function($http) {
	function CourseOffering(courseOfferingData) {
		if (courseOfferingData) {
			this.setData(courseOfferingData);
		}
	}
	CourseOffering.prototype = {
			setData: function(courseOfferingData) {
				angular.extend(this, courseOfferingData);
			}
	};
	return CourseOffering;
}]);
