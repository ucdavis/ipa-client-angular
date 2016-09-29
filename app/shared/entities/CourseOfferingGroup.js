angular.module('courseOfferingGroup', [])

.factory('CourseOfferingGroup', ['$http', function($http) {
	function CourseOfferingGroup(cogData) {
		if (cogData) {
			this.setData(cogData);
		}
	}
	CourseOfferingGroup.prototype = {
			setData: function(cogData) {
				angular.extend(this, cogData);
			}
	};
	return CourseOfferingGroup;
}]);
