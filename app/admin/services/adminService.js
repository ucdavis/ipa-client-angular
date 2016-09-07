'use strict';

/**
 * @ngdoc service
 * @name adminApp.adminService
 * @description
 * # adminService
 * Service in the adminApp.
 * adminApp specific api calls.
 */
adminApp.factory("adminService", this.adminService = function($http, $q) {
	return {
		getAdminView: function() {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/adminView", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
