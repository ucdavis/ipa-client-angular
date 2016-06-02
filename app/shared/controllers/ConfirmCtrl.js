sharedApp.controller('ConfirmCtrl', this.ConfirmCtrl = function($scope, $uibModalInstance, title, body, okButton, showCancel) {
	$scope.title = title;
	$scope.body = body;
	$scope.okButton = okButton;
	$scope.showCancel = showCancel;
	$scope.confirm = function() {
		return $uibModalInstance.close("confirm");
	};
	return $scope.cancel = function() {
		return $uibModalInstance.dismiss("cancel");
	};
});
