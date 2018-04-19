export function slowConnectionInterceptor ($q, $timeout, $rootScope) {
	var reqCount = 0;
	return {
		request: function (config) {
			reqCount++;
			if ($rootScope.slowResTime) { $timeout.cancel($rootScope.slowResTime); }
			if ($rootScope.timeOutTimer) { $timeout.cancel($rootScope.timeOutTimer); }

			var slowResDelay = 15000; // 8 seconds
			var timeOutDelay = 45000; // 45 seconds

			$rootScope.slowResTime = $timeout(function () {
				$rootScope.$emit('toast', { message: "Server appears to be slow. Please standby...", type: "WARNING" });
			}, slowResDelay);

			$rootScope.timeOutTimer = $timeout(function () {
				$rootScope.$emit('toast', { message: "Server appears to have failed.", type: "ERROR", options: { timeOut: 0, closeButton: true } });
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
		responseError: function (rejection) {
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
	};
};

slowConnectionInterceptor.$inject = ['$q', '$timeout', '$rootScope'];

export function tokenValidatorInterceptor ($q, $injector, $rootScope) {
	return {
		responseError: function (rejection) {
			if (rejection.status === 440) {
				// Delete expired token and revalidate
				localStorage.removeItem('JWT');
				var authService = $injector.get('authService');
				authService.validate().then(function () {
					// $rootScope.toast.message = "This is inconcieveable";
					$rootScope.$emit('toast', { message: "Unable to validate authentication.", type: "ERROR" });
				});
			}

			return $q.reject(rejection);
		}
	};
};

tokenValidatorInterceptor.$inject = ['$q', '$timeout', '$rootScope'];
