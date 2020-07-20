class BudgetComparisonReportService {
	constructor(ApiService, BudgetComparisonReportExcelService) {
		var _self = this;
		this.ApiService = ApiService;
		this.BudgetComparisonReportExcelService = BudgetComparisonReportExcelService;
		return {
			getBudget: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/budget");
			},
			getCourses: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/courses");
			},
			getInstructorTypes: function () {
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
			getLineItemCategories: function () {
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
			getUsers: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/users");
			},
			getUserRoles: function (workgroupId) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/userRoles");
			},
			getUserWorkgroupsScenarios: function (year) {
				return _self.ApiService.get("/api/years/" + year + "/budgetScenarios");
			},
			getInstructors: function (workgroupId, year) {
				return _self.ApiService.get("/api/workgroups/" + workgroupId + "/years/" + year + "/instructors");
			},
			downloadAsExcel: function (viewState, year, workgroupName) {
				// TODO: delete
				_self.BudgetComparisonReportExcelService.downloadAsExcel(viewState, year, workgroupName);
			},
			downloadBudgetComparisonExcel: function (budgetScenarioIdPairs) {
				return _self.ApiService.postWithResponseType("/api/budgetView/downloadBudgetComparisonExcel", budgetScenarioIdPairs, '', 'arraybuffer');
			}
		};
	}
}

BudgetComparisonReportService.$inject = ['ApiService', 'BudgetComparisonReportExcelService'];

export default BudgetComparisonReportService;
