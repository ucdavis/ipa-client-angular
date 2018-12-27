const CourseOffering = angular.module('CourseOffering', []) // eslint-disable-line no-undef

.factory('CourseOffering', function() {
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
});

export default CourseOffering;