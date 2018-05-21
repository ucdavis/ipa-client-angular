/**
 * @ngdoc service
 * @name ipaClientAngularApp.TeachingAssignmentService
 * @description
 * # TeachingAssignmentService
 * Service in the ipaClientAngularApp.
 */
class TeachingAssignmentService {
	constructor () {
		return {
			getDescription: function(teachingAssignment, course) {
				if (teachingAssignment.buyout) {
					return "Buyout";
				} else if (teachingAssignment.courseRelease) {
					return "Course Release";
				} else if (teachingAssignment.sabbatical) {
					return "Sabbatical";
				} else if (teachingAssignment.inResidence) {
					return "In Residence";
				} else if (teachingAssignment.workLifeBalance) {
					return "Work Life Balance";
				} else if (teachingAssignment.leaveOfAbsence) {
					return "Leave of Absence";
				} else if (course) {
					return course.subjectCode + " " + course.courseNumber;
				}

				return null;
			}
		};
	}
}

export default TeachingAssignmentService;
