class WorkloadSummaryService {
	constructor(ApiService, $q, $http, $window) {
		var _self = this;
		this.ApiService = ApiService;
		return {
			getInitialState: function (workgroupId, year, termCode) {
				return _self.ApiService.get("/api/scheduleSummaryReportView/workgroups/" + workgroupId + "/years/" + year + "/terms/" + termCode);
			},
			downloadWorkloadSummary: function (workgroupId, year, shortTermCode) {
				var deferred = $q.defer();
	
				$http.get(serverRoot + "/api/workloadSummaryReport/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
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