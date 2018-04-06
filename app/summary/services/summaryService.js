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
			.then(function(results) {
				deferred.resolve(results.data);
			},
			function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
