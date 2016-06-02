var slowConnectionInterceptor = function ($q, $timeout, $rootScope) {
	var reqCount = 0;
	return {
		request: function(config) {
			reqCount++;
			if ($rootScope.responseTimer) {
				$timeout.cancel($rootScope.responseTimer);
			}
			$rootScope.responseTimer = $timeout( function() {
				$rootScope.slowResponse = true;
			}, 6000);

			return config;
		},
		response: function(response) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.responseTimer);
				$rootScope.slowResponse = false;
			}

			return response;
		},
		responseError: function(rejection) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.responseTimer);
				$rootScope.slowResponse = false;
			}

			// Redirect 'Access Denied' responses to /accessDenied
			if (rejection.status === 403) {
				$rootScope.loadingError = 403;
			}

			return $q.reject(rejection);
		}
	}
};

sharedApp
	// Intercept Ajax traffic
	.config(function($httpProvider) {
		$httpProvider.interceptors.push(slowConnectionInterceptor);
	});
