/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:WorkgroupCtrl
 * @description
 * # WorkgroupCtrl
 * Controller of the ipaClientAngularApp
 */
class WorkgroupCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, $location, WorkgroupActionCreators, AuthService, validate) {
		this.$scope = $scope;
		this.AuthService = AuthService;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$location = $location;
		this.WorkgroupActionCreators = WorkgroupActionCreators;
		this.AuthService = AuthService;
		$scope.ROWS_PER_HEADER = 20;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = {};
		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$rootScope.$on('workgroupStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.openImpersonateModal = function() {
			$scope.view.isImpersonationModalOpen = true;
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
			$scope.setActiveTab('people');
		}
	}
}

WorkgroupCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', '$location', 'WorkgroupActionCreators', 'AuthService', 'validate'];

export default WorkgroupCtrl;
