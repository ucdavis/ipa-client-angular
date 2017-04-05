/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupCtrl
 * @description
 * # WorkgroupCtrl
 * Controller of the ipaClientAngularApp
 */
workgroupApp.controller('WorkgroupCtrl', ['$scope', '$rootScope', '$routeParams', '$location', '$uibModal',
		this.WorkgroupCtrl = function ($scope, $rootScope, $routeParams, $location, $uibModal) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = {};

		$rootScope.$on('workgroupStateChanged', function (event, data) {
			$scope.view.state = data;
			console.log($scope.view.state);
		});

		$scope.openImpersonateModal = function() {
			modalInstance = $uibModal.open({
				templateUrl: 'ModalImpersonate.html',
				controller: ModalImpersonateCtrl,
				size: 'lg',
				resolve: {
					state: function () {
						return $scope.view.state;
					}
				}
			});
		};

		$scope.setActiveTab = function (tabName) {
			$scope.activeWorkgroupTab = tabName;
			$location.search({ tab: tabName });
		};

		$scope.hasWriteAccess = function (roleId, loginId) {
			if (roleId && $scope.view.state.roles.list[roleId].name === 'academicPlanner' &&
				$scope.sharedState.currentUser.loginId === loginId) {
				return $scope.sharedState.currentUser.isAdmin();
			} else {
				return $scope.sharedState.currentUser.isAdmin() ||
					$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
			}
		};

		if ($routeParams.tab) {
			// Set the active tab according to the URL
			$scope.activeWorkgroupTab = $routeParams.tab;
		} else {
			// Otherwise redirect to the default view
			$scope.setActiveTab('tags');
		}
	}]);

WorkgroupCtrl.getPayload = function (authService, workgroupActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return workgroupActionCreators.getInitialState($route.current.params.workgroupId);
	});
};