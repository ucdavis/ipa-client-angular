class TeachingCallResponseReportService {
	constructor($http, $q, $window, ApiService) {
		this.$http = $http;
		this.$q = $q;
		this.$window = $window;
		this.apiService = ApiService;

		return {
			getInitialState: function (workgroupId, year) {
				return ApiService.get("/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year);
			},
			download: function (workgroupId, year) {
				var deferred = $q.defer();

				$http.get(serverRoot + "/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
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

TeachingCallResponseReportService.$inject = ['$http', '$q', '$window', 'ApiService'];

export default TeachingCallResponseReportService;
