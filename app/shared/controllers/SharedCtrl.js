'use strict';

/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:SharedCtrl
 * @description
 * # SharedCtrl
 * Controller of the ipaClientAngularApp
 */
sharedApp.controller('SharedCtrl', ['$scope', '$rootScope', '$http', '$uibModal', 'authService',
		this.SharedCtrl = function ($scope, $rootScope, $http, $uibModal, authService) {

			$rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
				if (!$rootScope.loadingError) { $rootScope.loadingError = 'unknown'; }
				console.error('Failed to change routes. Error code: ' + $rootScope.loadingError);
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
				authService.logout("/");
			});

	}]);
