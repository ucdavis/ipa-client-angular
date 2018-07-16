class DeansOfficeReportService {
	constructor(ApiService, $q, $http, $window) {
		var _self = this;
		this.ApiService = ApiService;
		return {
			getBudget: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/budget");
			},
			getCourses: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/courses");
			},
			getInstructorTypes: function (workgroupId, year) {
				return _self.ApiService.get("/api/instructorTypes");
			},
			getTeachingAssignments: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/teachingAssignments");
			},
			getSectionGroups: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups");
			},
			getSections: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sections");
			},
			getLineItems: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/lineItems");
			},
			getBudgetScenarios: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/budgetScenarios");
			},
			getLineItemCategories: function (workgroupId, year) {
				return _self.ApiService.get("/api/lineItemCategories");
			},
			getInstructorTypeCosts: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/instructorTypeCosts");
			},
			getInstructorCosts: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/instructorCosts");
			},
			getSectionGroupCosts: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/sectionGroupCosts");
			},
			getUsers: function (workgroupId) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/users");
			},
			getUserRoles: function (workgroupId) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/userRoles");
			},
			getInstructors: function (workgroupId) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/instructors");
			},

		};
	}
}

DeansOfficeReportService.$inject = ['ApiService', '$q', '$http', '$window'];

export default DeansOfficeReportService;