function exceptionHandler($provide) {
	$provide.decorator("$exceptionHandler", function($delegate, $injector) {
		return function(exception, cause) {
			$delegate(exception, cause);

			var $http = $injector.get("$http");
			var $location = $injector.get("$location");
			var $rootScope = $injector.get("$rootScope");
			$rootScope.errorsSent = $rootScope.errorsSent || [];

			// Make sure an error is sent only once
			if ($rootScope.errorsSent.indexOf(exception.message) < 0) {
				$rootScope.errorsSent.push(exception.message);
				var exceptionObject = {
						message: exception.message,
						stack: exception.stack,
						url: $location.absUrl()
				};
				
				$http.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem("JWT"); // Set proper headers
				$http.post(serverRoot + "/api/reportJsException", exceptionObject, { withCredentials: true }).then(function(res) {
					return res.data;
				});
			}
		};
	});
}

exceptionHandler.$inject = ['$provide'];

export default exceptionHandler;