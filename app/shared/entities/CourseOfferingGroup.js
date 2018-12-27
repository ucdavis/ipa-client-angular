const CourseOfferingGroup = angular.module('CourseOfferingGroup', []) // eslint-disable-line no-undef

.factory('CourseOfferingGroup', function() {
	function CourseOfferingGroup(cogData) {
		if (cogData) {
			this.setData(cogData);
		}
	}
	CourseOfferingGroup.prototype = {
			setData: function(cogData) {
				angular.extend(this, cogData); // eslint-disable-line no-undef
			}
	};
	return CourseOfferingGroup;
});

export default CourseOfferingGroup;