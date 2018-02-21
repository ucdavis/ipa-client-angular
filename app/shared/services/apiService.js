angular.module('sharedApp')
	.service('apiService', function ($http, $q) {
		return {
			get: function(url, data, serverUrl) {
				serverUrl = serverUrl || serverRoot;

				var config = {
					method: "GET",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			delete: function(url, data, serverUrl) {
				serverUrl = serverUrl || serverRoot;

				var config = {
					method: "DELETE",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			put: function(url, data, serverUrl) {
				serverUrl = serverUrl || serverRoot;

				var config = {
					method: "PUT",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			post: function(url, data, serverUrl) {
				serverUrl = serverUrl || serverRoot;

				var config = {
					method: "POST",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			query: function (config) {
				var deferred = $q.defer();

				$http(config)
				.success(function(results) {
					deferred.resolve(results);
				})
				.error(function() {
					deferred.reject();
				});

				return deferred.promise;
			}
		};
	});
