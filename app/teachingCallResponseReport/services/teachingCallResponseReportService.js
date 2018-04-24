/**
 * @ngdoc service
 * @name teachingCallResponseReportApp.teachingCallResponseReportService
 * @description
 * # teachingCallResponseReportService
 * Service in the teachingCallResponseReportApp.
 * teachingCallResponseReportApp specific api calls.
 */
class TeachingCallResponseReportService {
	constructor($http, $q, $window, apiService) {
		this.$http = $http;
		this.$q = $1q;
		this.$window = $window;
		this.apiService = apiService;

		return {
			getInitialState: function (workgroupId, year) {
				return apiService.get("/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year);
			},
			download: function (workgroupId, year) {
				$http.get(serverRoot + "/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/generateExcel", { withCredentials: true })
				.then(function(payload) {
					$window.location.href = payload.redirect;
					deferred.resolve(payload);
				},
				function() {
					deferred.reject();
				});
	
				return deferred.promise;
			}
		};
	}
}

TeachingCallResponseReportService.$inject = ['$http', '$q', '$window', 'apiService'];

export default TeachingCallResponseReportService;
