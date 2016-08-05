sharedApp.config(function($provide) {
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

				// TODO: Create this controller method on the backend
				// $http.post(serverRoot + "/reportJsException/", exceptionObject, { withCredentials: true }).then(function(res) {
				// 	return res.data;
				// });
			}
		};
	});
});