 // eslint-disable-next-line no-undef
const TeachingAssignment = angular.module('TeachingAssignment', [])

.factory('TeachingAssignment', function() {
	function TeachingAssignment(teachingAssignmentData) {
		if (teachingAssignmentData) {
			this.setData(teachingAssignmentData);
		}
	}
	TeachingAssignment.prototype = {
			setData: function(teachingAssignmentData) {
				angular.extend(this, teachingAssignmentData); // eslint-disable-line no-undef
			}
	};
	return TeachingAssignment;
});

export default TeachingAssignment;