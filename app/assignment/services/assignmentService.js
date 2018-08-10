/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
class AssignmentService {
	constructor (ApiService, $q, $http, $window) {
		return {
			getInitialState: function(workgroupId, year) {
				return ApiService.get("/api/assignmentView/" + workgroupId + "/" + year);
			},
			download: function (workgroupId, year) {
				var deferred = $q.defer();
	
				$http.get(serverRoot + "/api/assignmentView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
				.then(function(payload) {
					$window.location.href = payload.data.redirect;
					deferred.resolve(payload.data);
				},
				function() {
					deferred.reject();
				});
	
				return deferred.promise;
			},
			updateCourse: function (course) {
				return ApiService.put("/api/courseView/courses/" + course.id, course);
			},
			updateInstructorNote: function (instructorNote) {
				return ApiService.put("/api/schedules/" + instructorNote.scheduleId + "/instructors/" + instructorNote.instructorId + "/instructorNotes", instructorNote);
			},
			updateSectionGroup: function (sectionGroup) {
				return ApiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
			},
			createTeachingCall: function (workgroupId, year, teachingCallConfig) {
				return ApiService.post("/api/assignmentView/" + workgroupId + "/" + year + "/teachingCalls", teachingCallConfig);
			},
			addPreference: function (teachingAssignment) {
				return ApiService.post("/api/assignmentView/preferences/" + teachingAssignment.schedule.id, teachingAssignment);
			},
			removePreference: function (teachingAssignment) {
				return ApiService.delete("/api/assignmentView/preferences/" + teachingAssignment.id);
			},
			deleteTeachingCall: function (teachingCall) {
				return ApiService.delete("/api/assignmentView/teachingCalls/" + teachingCall.id);
			},
			addInstructorAssignment: function (teachingAssignment, scheduleId) {
				teachingAssignment.termCode = String(teachingAssignment.termCode);
	
				return ApiService.post("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments", teachingAssignment);
			},
			updateInstructorAssignment: function (teachingAssignment) {
				return ApiService.put("/api/assignmentView/teachingAssignments/" + teachingAssignment.id, teachingAssignment);
			},
			addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
				var scheduleInstructorNote = {};
				scheduleInstructorNote.instructorComment = comment;
				scheduleInstructorNote.assignmentsCompleted = assignmentsCompleted;
	
				return ApiService.post("/api/assignmentView/scheduleInstructorNotes/" + instructorId + "/" + workgroupId + "/" + year, scheduleInstructorNote);
			},
			assignStudentToAssociateInstructor: function (sectionGroupId, supportStaffId) {
				return ApiService.post("/api/assignmentView/sectionGroups/" + sectionGroupId + "/supportStaff/" + supportStaffId + "/assignAI");
			},
			updateScheduleInstructorNote: function (scheduleInstructorNote) {
				return ApiService.put("/api/assignmentView/scheduleInstructorNotes/" + scheduleInstructorNote.id, scheduleInstructorNote);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				return ApiService.put("/api/assignmentView/schedules/" + scheduleId + "/teachingAssignments" , sortedTeachingAssignmentIds);
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				return ApiService.put("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.id, teachingCallResponse);
			},
			addTeachingCallResponse: function (teachingCallResponse) {
				return ApiService.post("/api/assignmentView/teachingCallResponses/" + teachingCallResponse.scheduleId  + "/" + teachingCallResponse.instructorId, teachingCallResponse);
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				return ApiService.put("/api/assignmentView/teachingCallReceipts/" + teachingCallReceipt.id, teachingCallReceipt);
			},
			searchCourses: function(query) {
				return ApiService.get("/courses/search?q=" + query + "&token=" + dwToken, null, dwUrl);
			},
			allTerms: function () {
				var allTerms = {
					'05': 'Summer Session 1',
					'06': 'Summer Special Session',
					'07': 'Summer Session 2',
					'08': 'Summer Quarter',
					'09': 'Fall Semester',
					'10': 'Fall Quarter',
					'01': 'Winter Quarter',
					'02': 'Spring Semester',
					'03': 'Spring Quarter'
				};
	
				return allTerms;
			}
		};
	}
}

AssignmentService.$inject = ['ApiService', '$q', '$http', '$window'];

export default AssignmentService;
