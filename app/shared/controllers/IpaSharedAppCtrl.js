sharedApp.controller('SharedCtrl', this.SharedCtrl = function(
		$rootScope,
		$scope,
		$http,
		$uibModal,
		Idle,
		Keepalive,
		siteConfig) {

	$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
		if (!$rootScope.loadingError) { $rootScope.loadingError = 'unknown'; }
		console.error('Failed to change routes. Error code: ' + $rootScope.loadingError);
	});

	$scope.print = function(){
		window.print();
	};

	// ngIdle stuff
	$scope.rootUrl = siteConfig.rootUrl;

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

	$scope.$on('IdleStart', function() {
		closeModals();

		$scope.warning = $uibModal.open({
			templateUrl: 'sessionWarning.html',
			backdrop : 'static'
		});
	});

	$scope.$on('IdleEnd', function() {
		closeModals();
		$scope.$digest();
	});

	$scope.$on('IdleTimeout', function() {
		closeModals();

		$scope.timedout = $uibModal.open({
			templateUrl: 'sessionTimedout.html',
			backdrop : 'static',
			scope: $scope
		});
	});

	$scope.$on('Keepalive', function() {
		$http.get("/status.json");
    });

});
