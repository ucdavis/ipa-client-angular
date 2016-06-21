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
		addTag: function (workgroupCode, tag) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/" + workgroupCode + "/tags", tag, { withCredentials: true })
			.success(function(tag) {
				deferred.resolve(tag);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateTag: function (workgroupCode, tag) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/workgroupView/" + workgroupCode + "/tags/" + tag.id, tag, { withCredentials: true })
			.success(function(tag) {
				deferred.resolve(tag);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeTag: function(workgroupCode, tag) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/" + workgroupCode + "/tags/" + tag.id, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addLocation: function (workgroupCode, location) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/" + workgroupCode + "/locations", location, { withCredentials: true })
			.success(function(location) {
				deferred.resolve(location);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		updateLocation: function (workgroupCode, location) {
			var deferred = $q.defer();

			$http.put(serverRoot + "/api/workgroupView/" + workgroupCode + "/locations/" + location.id, location, { withCredentials: true })
			.success(function(location) {
				deferred.resolve(location);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeLocation: function(workgroupCode, location) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/" + workgroupCode + "/locations/" + location.id, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		addRoleToUser: function (workgroupCode, user, role) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupCode + "/roles/" + role.name, null, { withCredentials: true })
			.success(function(userRole) {
				deferred.resolve(userRole);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		removeRoleFromUser: function (workgroupCode, user, role) {
			var deferred = $q.defer();

			$http.delete(serverRoot + "/api/workgroupView/users/" + user.loginId + "/workgroups/" + workgroupCode + "/roles/" + role.name, { withCredentials: true })
			.success(function() {
				deferred.resolve();
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		searchUsers: function(workgroupCode, query) {
			var deferred = $q.defer();

			$http.get(serverRoot + "/api/workgroupView/workgroups/" + workgroupCode + "/userSearch?query=" + query, { withCredentials: true })
			.success(function(result) {
				deferred.resolve(result);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		},
		createUser: function (user) {
			var deferred = $q.defer();

			$http.post(serverRoot + "/api/workgroupView/users", user, { withCredentials: true })
			.success(function(newUser) {
				deferred.resolve(newUser);
			})
			.error(function() {
				deferred.reject();
			});

			return deferred.promise;
		}
	};
});
