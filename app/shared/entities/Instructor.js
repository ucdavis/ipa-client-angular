 // eslint-disable-next-line no-undef
const Instructor = angular.module('Instructor', [])
.factory('Instructor', function() {
	function Instructor(instructorData) {
		if (instructorData) {
			this.setData(instructorData);
		}
	}
	Instructor.prototype = {
			setData: function(instructorData) {
				angular.extend(this, instructorData); // eslint-disable-line no-undef
			}
	};
	return Instructor;
});

export default Instructor;