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
				} else if (teachingAssignment.sabbaticalInResidence) {
					return "Sabbatical In Residence";
				} else if (course) {
					return course.subjectCode + " " + course.courseNumber;
				}

				return null;
			},
			getInstructorDescription: function(teachingAssignment, instructor, instructorType) {
				// Ensure the proper entities were supplied
				if (instructor && teachingAssignment.instructorId != instructor.id) { return null; }
				if (instructorType && teachingAssignment.instructorTypeId != instructorType.id) { return null; }

				if (instructor) {
					return instructor.firstName + " " + instructor.lastName;
				} else if (instructorType) {
					return instructorType.description;
				}

				// Return null if no source for the name was provided
				return null;
			}
		};
	}
}

export default TeachingAssignmentService;
