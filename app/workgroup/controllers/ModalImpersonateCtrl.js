class ModalImpersonateCtrl {
	constructor ($scope, $rootScope, $uibModalInstance, AuthService, WorkgroupActionCreators, state) {
		$scope.state = state;
	
		$scope.selectUser = function (user) {
			$scope.selectedUser = user;
		};
	
		$scope.impersonate = function () {
			authService.impersonate($scope.selectedUser.loginId);
		};
	
		$scope.canBeImpersonated = function(user) {
			var canBeImpersonated = false;
	
			user.userRoles.forEach( function(userRole) {
				if (userRole.role == "studentMasters"
				|| userRole.role == "studentPhd"
				|| userRole.role == "senateInstructor"
				|| userRole.role == "federationInstructor"
				|| userRole.role == "instructionalSupport") {
						canBeImpersonated = true;
					}
			});
	
			return canBeImpersonated;
		};
	
		$scope.dismiss = function () {
			$uibModalInstance.dismiss('cancel');
		};
	}
}

ModalImpersonateCtrl.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'AuthService', 'WorkgroupActionCreators', 'state'];

export default ModalImpersonateCtrl;
