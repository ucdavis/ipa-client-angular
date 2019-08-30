class TaReaderUtilizationReportService {
  constructor(ApiService) {
    var _self = this;
    this.ApiService = ApiService;
    return {
      getBudget: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/budget"
        );
      },
      getCourses: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/courses"
        );
      },
      getInstructorTypes: function() {
        return _self.ApiService.get("/api/instructorTypes");
      },
      getTeachingAssignments: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" +
            workgroupId +
            "/years/" +
            year +
            "/teachingAssignments"
        );
      },
      getSectionGroups: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/sectionGroups"
        );
      },
      getSections: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/sections"
        );
      },
      getLineItems: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/lineItems"
        );
      },
      getBudgetScenarios: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" +
            workgroupId +
            "/years/" +
            year +
            "/budgetScenarios"
        );
      },
      getLineItemCategories: function() {
        return _self.ApiService.get("/api/lineItemCategories");
      },
      getInstructorTypeCosts: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" +
            workgroupId +
            "/years/" +
            year +
            "/instructorTypeCosts"
        );
      },
      getInstructorCosts: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" +
            workgroupId +
            "/years/" +
            year +
            "/instructorCosts"
        );
      },
      getSectionGroupCosts: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" +
            workgroupId +
            "/years/" +
            year +
            "/sectionGroupCosts"
        );
      },
      getUsers: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/users"
        );
      },
      getUserRoles: function(workgroupId) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/userRoles"
        );
      },
      getInstructors: function(workgroupId, year) {
        return _self.ApiService.get(
          "/api/workgroups/" + workgroupId + "/years/" + year + "/instructors"
        );
      },
      downloadAsExcel: function(viewState, year, workgroupName) {
        _self.BudgetComparisonReportExcelService.downloadAsExcel(
          viewState,
          year,
          workgroupName
        );
      }
    };
  }
}

TaReaderUtilizationReportService.$inject = [
  "ApiService",
];

export default TaReaderUtilizationReportService;