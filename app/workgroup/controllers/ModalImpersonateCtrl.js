workgroupApp.controller('ModalImpersonateCtrl', this.ModalImpersonateCtrl = function( // eslint-disable-line no-undef
	$scope, $rootScope, $uibModalInstance, authService, workgroupActionCreators, state) {

	$scope.state = state;

	$scope.selectUser = function (user) {
		$scope.selectedUser = user;
	};

	$scope.impersonate = function () {
		authService.impersonate($scope.selectedUser.loginId);
	};

	$scope.canBeImpersonated = function(user) {
		var canBeImpersonated = false;

		user.userRoles.forEach(function(userRole) {
			if (userRole.role == "studentMasters"
			|| userRole.role == "studentPhd"
			|| userRole.role == "instructor"
			|| userRole.role == "instructionalSupport") {
					canBeImpersonated = true;
				}
		});

		return canBeImpersonated;
	};

	$scope.dismiss = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
