angular.module('sharedApp')
	.service('apiService', function ($http, $q) {
		return {
			get: function(url, data) {
				var config = {
					method: "GET",
					url: serverRoot + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			delete: function(url, data) {
				var config = {
					method: "DELETE",
					url: serverRoot + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			put: function(url, data) {
				var config = {
					method: "PUT",
					url: serverRoot + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			post: function(url, data) {
				var config = {
					method: "POST",
					url: serverRoot + url,
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
