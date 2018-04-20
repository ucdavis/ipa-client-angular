const TeachingAssignment = angular.module('TeachingAssignment', [])

.factory('TeachingAssignment', ['$http', function($http) {
	function TeachingAssignment(teachingAssignmentData) {
		if (teachingAssignmentData) {
			this.setData(teachingAssignmentData);
		}
	}
	TeachingAssignment.prototype = {
			setData: function(teachingAssignmentData) {
				angular.extend(this, teachingAssignmentData);
			}
	};
	return TeachingAssignment;
}]);

export default TeachingAssignment;