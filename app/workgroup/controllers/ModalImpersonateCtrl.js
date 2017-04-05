workgroupApp.controller('ModalImpersonateCtrl', this.ModalImpersonateCtrl = function(
	$scope, $rootScope, $uibModalInstance, authService, workgroupActionCreators, state) {

	$scope.state = state;

	$scope.selectUser = function (user) {
		$scope.selectedUser = user;
	};

	$scope.impersonate = function () {
		authService.impersonate($scope.selectedUser.loginId);
	};

	$scope.dismiss = function () {
		$uibModalInstance.dismiss('cancel');
	};
});