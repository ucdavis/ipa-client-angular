'use strict';

/**
 * @ngdoc service
 * @name workgroupApp.workgroupService
 * @description
 * # workgroupService
 * Service in the workgroupApp.
 * workgroupApp specific api calls.
 */
assignmentApp.factory("assignmentService", this.assignmentService = function($http, $q) {
	return {
		getCoursesByWorkgroupIdAndYear: function(workgroupId, year) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/assignmentView/" + workgroupId + "/" + year + "/courses", { withCredentials: true })
			.success(function(courses) {
				deferred.resolve(courses);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
