class DeansOfficeReportService {
	constructor(ApiService, $q, $http, $window) {
		var _self = this;
		this.ApiService = ApiService;
		return {
			getCourses: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/courses");
			},
			getInstructorTypes: function (workgroupId, year) {
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
			getUserRoles: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/userRoles");
			},
			getSections: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sections");
			}
		};
	}
}

DeansOfficeReportService.$inject = ['ApiService', '$q', '$http', '$window'];

export default DeansOfficeReportService;