'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
summaryApp.factory("summaryService", this.summaryService = function($http, $q) {
	return {
		getInitialState: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/summaryView/" + workgroupId + "/" + year, { withCredentials: true })
			.success(function(summaryView) {
				deferred.resolve(summaryView);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
