/**
 * @ngdoc service
 * @name reportApp.reportService
 * @description
 * # reportService
 * Service in the reportApp.
 * reportApp specific api calls.
 */
reportApp.factory("reportService", this.reportService = function ($http, $q, $window) {
	return {
		getSchedulesToCompare: function (workgroupId) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/reportView/workgroups/" + workgroupId, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		getTermComparisonReport: function (workgroupId, year, termCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/reportView/workgroups/" + workgroupId + "/years/" + year + "/termCode/" + termCode, { withCredentials: true })
				.success(function (payload) {
					deferred.resolve(payload);
				})
				.error(function () {
					deferred.reject();
				});

			return deferred.promise;
		},
		updateSection: function (section) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/reportView/sections/" + section.id, section, { withCredentials: true })
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
