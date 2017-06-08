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
			debugger;
			$http.get(serverRoot + "/api/adminView", { withCredentials: true })
			.success(function(payload) {
				deferred.resolve(payload);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateWorkgroup: function(workgroup) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/adminView/workgroups/" + workgroup.id, workgroup, { withCredentials: true })
			.success(function(workgroup) {
				deferred.resolve(workgroup);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeWorkgroup: function(workgroupId) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/adminView/workgroups/" + workgroupId, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addWorkgroup: function(workgroup) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/adminView/workgroups", workgroup, { withCredentials: true })
			.success(function(workgroup) {
				deferred.resolve(workgroup);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
