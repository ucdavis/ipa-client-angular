/**
 * @ngdoc service
 * @name teachingCallResponseReportApp.teachingCallResponseReportService
 * @description
 * # teachingCallResponseReportService
 * Service in the teachingCallResponseReportApp.
 * teachingCallResponseReportApp specific api calls.
 */
teachingCallResponseReportApp.factory("teachingCallResponseReportService", this.teachingCallResponseReportService = function ($http, $q, $window) {
	return {
		getInitialState: function (workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		download: function (workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/teachingCallResponseReportView/workgroups/" + workgroupId + "/years/" + year + "/downloadExcel", { withCredentials: true })
			.success(function(payload) {
				$window.location.href = payload.redirect;
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
