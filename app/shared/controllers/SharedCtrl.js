class SharedCtrl {
	constructor ($scope, $rootScope, $http, $uibModal, $log, AuthService) {
		$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
			if (!$rootScope.loadingError) { $rootScope.loadingError = 'unknown'; }
			$log.error('Failed to change routes. Error code: ' + $rootScope.loadingError);
		});

		$scope.print = function () {
			window.print();
		};

		// ngIdle stuff
		function closeModals() {
			if ($scope.warning) {
				$scope.warning.close();
				$scope.warning = null;
			}

			if ($scope.timedout) {
				$scope.timedout.close();
				$scope.timedout = null;
			}
		}

		$scope.$on('IdleStart', function () {
			closeModals();

			$scope.warning = $uibModal.open({
				templateUrl: 'sessionWarning.html',
				backdrop: 'static'
			});
		});

		$scope.$on('IdleEnd', function () {
			closeModals();
		});

		$scope.$on('IdleTimeout', function () {
			AuthService.logout("/");
		});
	}
}

SharedCtrl.$inject = ['$scope', '$rootScope', '$http', '$uibModal', '$log', 'AuthService'];

export default SharedCtrl;