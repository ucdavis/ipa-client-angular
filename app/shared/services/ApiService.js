class ApiService {
	constructor ($http, $q) {
		this.$http = $http;
		this.$q = $q;

		return {
			get: function(url, data, serverUrl) {
				serverUrl = serverUrl || window.serverRoot;

				var config = {
					method: "GET",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			delete: function(url, data, serverUrl) {
				serverUrl = serverUrl || window.serverRoot;

				var config = {
					method: "DELETE",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			put: function(url, data, serverUrl) {
				serverUrl = serverUrl || window.serverRoot;

				var config = {
					method: "PUT",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			post: function(url, data, serverUrl) {
				serverUrl = serverUrl || window.serverRoot;

				var config = {
					method: "POST",
					url: serverUrl + url,
					data: data,
					withCredentials: true 
				};

				return this.query(config);
			},
			postWithResponseType: function(url, data, serverUrl, responseType) {
				serverUrl = serverUrl || window.serverRoot;
				var config = {
					method: "POST",
					url: serverUrl + url,
					data: data,
					responseType: responseType,
					withCredentials: true
				};
				return this.query(config);
			},
			query: function (config) {
				var deferred = $q.defer();

				$http(config)
				.then(function(response) {
					deferred.resolve(response.data);
				},
				function() {
					deferred.reject();
				});

				return deferred.promise;
			}
		};
	}
}

export default ApiService;
