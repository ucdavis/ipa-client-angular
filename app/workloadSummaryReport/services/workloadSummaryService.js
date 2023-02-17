class WorkloadSummaryService {
	constructor(ApiService, $q, $http, $window) {
		var _self = this;
		this.ApiService = ApiService;
		return {
			getCourses: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/courses");
			},
			getInstructorTypes: function () {
				return _self.ApiService.get("/api/instructorTypes");
			},
			getInstructors: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/instructors");
			},
			getTeachingAssignments: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/teachingAssignments");
			},
			getSectionGroups: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups");
			},
			getUsers: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/users");
			},
			getUserRoles: function (workgroupId) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/userRoles");
			},
			getScheduleInstructorNotes: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/scheduleInstructorNotes");
			},
			getSections: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sections");
			},
			getWorkloadSnapshots: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/workloadSnapshots");
			},
			downloadWorkloadSnapshot: function (workloadSnapshotId) {
				var deferred = $q.defer();
	
				$http.get(window.serverRoot + "/api/workloadSnapshots/" + workloadSnapshotId + "/generateExcel", { withCredentials: true })
					.then(function (payload) {
						$window.location.href = payload.data.redirect;
						deferred.resolve(payload.data);
					},
					function () {
						deferred.reject();
					});
	
				return deferred.promise;
			},
			downloadWorkloadSummary: function (workgroupId, year) {
				var deferred = $q.defer();
	
				$http.get(window.serverRoot + "/api/workloadSummaryReport/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
					.then(function (payload) {
						$window.location.href = payload.data.redirect;
						deferred.resolve(payload.data);
					},
					function () {
						deferred.reject();
					});
	
				return deferred.promise;
			}
		};
	}
}

WorkloadSummaryService.$inject = ['ApiService', '$q', '$http', '$window'];

export default WorkloadSummaryService;