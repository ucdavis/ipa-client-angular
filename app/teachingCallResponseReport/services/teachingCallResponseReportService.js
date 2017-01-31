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
		}
	};
});
