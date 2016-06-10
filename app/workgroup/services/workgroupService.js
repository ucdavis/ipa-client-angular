'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
workgroupApp.factory("workgroupService", this.workgroupService = function($http, $q) {
	return {
		getWorkgroupByCode: function(workgroupCode) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/workgroupView/" + workgroupCode, { withCredentials: true })
			.success(function(workgroup) {
				deferred.resolve(workgroup);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addTag: function(workgroupCode, tag) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/" + workgroupCode + "/tags", tag, { withCredentials: true })
			.success(function(tag) {
				deferred.resolve(tag);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
