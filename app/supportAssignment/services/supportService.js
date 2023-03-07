class SupportService {
	constructor ($http, $q, $window, ApiService) {
		this.$http = $http;
		this.$q = $q;
		this.$window = $window;

		return {
			getInitialState: function(workgroupId, year, termShortCode) {
				return ApiService.get("/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode);
			},
			deleteAssignment: function(supportAssignment) {
				return ApiService.delete("/api/instructionalSupportView/instructionalSupportAssignments/" + supportAssignment.id);
			},
			assignStaffToSectionGroup: function(sectionGroupId, supportStaffId, type) {
				return ApiService.post("/api/instructionalSupportView/sectionGroups/" + sectionGroupId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
			},
			assignStaffToSection: function(sectionId, supportStaffId, type) {
				return ApiService.post("/api/instructionalSupportView/sections/" + sectionId + "/assignmentType/" + type + "/supportStaff/" + supportStaffId);
			},
			toggleSupportStaffSupportCallReview: function(scheduleId, termShortCode) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleSupportStaffSupportCallReview");
			},
			toggleInstructorSupportCallReview: function(scheduleId, termShortCode) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + scheduleId + "/terms/" + termShortCode + "/toggleInstructorSupportCallReview");
			},
			updateSupportAppointment: function (supportAppointment) {
				return ApiService.put("/api/instructionalSupportView/schedules/" + supportAppointment.scheduleId, supportAppointment);
			},
			updateSectionGroup: function (sectionGroup) {
				return ApiService.put("/api/courseView/sectionGroups/" + sectionGroup.id, sectionGroup);
			},
			getAuditLogs: function (workgroupId, year) {
				var endpoint = "/api/workgroups/" + workgroupId + "/years/" + year + "/modules/Support Staff Assignments" + "/auditLogs";
				return ApiService.get(encodeURI(endpoint));
			},
			download: function(workgroupId, year, termShortCode) {
				var deferred = $q.defer();

				const url = window.serverRoot + "/api/instructionalSupportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termShortCode + "/generateExcel";
		
				$http.get(url, { withCredentials: true })
				.then(function(payload) {
					$window.location.href = payload.data.redirect;
					deferred.resolve(payload.data);
				},
				function() {
					deferred.reject();
				});
		
				return deferred.promise;
			}
		};
	}
}

SupportService.$inject = ['$http', '$q', '$window', 'ApiService'];

export default SupportService;
