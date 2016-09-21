var slowConnectionInterceptor = function ($q, $timeout, $rootScope) {
	var reqCount = 0;
	return {
		request: function(config) {
			reqCount++;
			if ($rootScope.slowResTime) { $timeout.cancel($rootScope.slowResTime); }
			if ($rootScope.timeOutTimer) { $timeout.cancel($rootScope.timeOutTimer); }

			var slowResDelay = 5000; // 5 seconds
			var timeOutDelay = 30000; // 30 seconds

			$rootScope.slowResTime = $timeout(function () {
				$rootScope.$emit('toast', {message: "Server appears to be slow. Please standby...", type: "WARNING"});
			}, slowResDelay);

			$rootScope.timeOutTimer = $timeout(function () {
				$rootScope.$emit('toast', {message: "Server apears to have failed. Please try again.", type: "ERROR", options: {timeOut: 0, closeButton: true} });
			}, timeOutDelay);

			return config;
		},
		response: function (response) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.slowResTime);
				$timeout.cancel($rootScope.timeOutTimer);
				toastr.clear();
			}

			return response;
		},
		responseError: function(rejection) {
			if (--reqCount === 0) {
				$timeout.cancel($rootScope.slowResTime);
				$timeout.cancel($rootScope.timeOutTimer);
				toastr.clear();
			}

			// Redirect 'Access Denied' responses to /accessDenied
			if (rejection.status === 403) {
				$rootScope.loadingError = 403;
			}

			return $q.reject(rejection);
		}
	}
};

var tokenValidatorInterceptor = function ($q, $injector, $rootScope) {
	return {
		responseError: function(rejection) {
			if (rejection.status === 440) {
				// Delete expired token and revalidate
				localStorage.removeItem('JWT');
				var authService = $injector.get('authService');
				authService.validate().then(function(){
					// $rootScope.toast.message = "This is inconcieveable";
					$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR"});
				});
			}

			return $q.reject(rejection);
		}
	}
};

sharedApp
	// Intercept Ajax traffic
	.config(function($httpProvider) {
		$httpProvider.interceptors.push(slowConnectionInterceptor);
		$httpProvider.interceptors.push(tokenValidatorInterceptor);
	});
