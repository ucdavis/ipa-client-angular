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
		getWorkgroupByCode: function(workgroupId) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/workgroupView/" + workgroupId, { withCredentials: true })
			.success(function(workgroup) {
				deferred.resolve(workgroup);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addTag: function (workgroupId, tag) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/" + workgroupId + "/tags", tag, { withCredentials: true })
			.success(function(tag) {
				deferred.resolve(tag);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateTag: function (workgroupId, tag) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/workgroupView/" + workgroupId + "/tags/" + tag.id, tag, { withCredentials: true })
			.success(function(tag) {
				deferred.resolve(tag);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeTag: function(workgroupId, tag) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/" + workgroupId + "/tags/" + tag.id, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addLocation: function (workgroupId, location) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/" + workgroupId + "/locations", location, { withCredentials: true })
			.success(function(location) {
				deferred.resolve(location);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateLocation: function (workgroupId, location) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/workgroupView/" + workgroupId + "/locations/" + location.id, location, { withCredentials: true })
			.success(function(location) {
				deferred.resolve(location);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeLocation: function(workgroupId, location) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/" + workgroupId + "/locations/" + location.id, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addRoleToUser: function (workgroupId, user, role) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name, null, { withCredentials: true })
			.success(function(userRole) {
				deferred.resolve(userRole);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeRoleFromUser: function (workgroupId, user, role) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupId + "/roles/" + role.name, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		searchUsers: function(workgroupId, query) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/workgroupView/workgroups/" + workgroupId + "/userSearch?query=" + query, { withCredentials: true })
			.success(function(result) {
				deferred.resolve(result);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createUser: function (workgroupId, user) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/workgroups/" + workgroupId + "/users", user, { withCredentials: true })
			.success(function(newUser) {
				deferred.resolve(newUser);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeUserFromWorkgroup: function (workgroupId, user) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/workgroups/" + workgroupId + "/users/" + user.loginId, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
