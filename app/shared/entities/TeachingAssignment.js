/**
 * @author okadri
 * Stores instructor receipt information for a given TeachingCall
 * It has a flag to indicate whether the instructor has completed inputing preferences
 */
angular.module('teachingAssignment', [])

.factory('TeachingAssignment', ['$http', function($http) {
	function TeachingAssignment(teachingAssignmentData) {
		if (teachingAssignmentData) {
			this.setData(teachingAssignmentData);
		}
	};
	TeachingAssignment.prototype = {
			setData: function(teachingAssignmentData) {
				angular.extend(this, teachingAssignmentData);
			}
	};
	return TeachingAssignment;
}]);
