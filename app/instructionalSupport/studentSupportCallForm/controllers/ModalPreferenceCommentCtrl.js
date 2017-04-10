instructionalSupportApp.controller('ModalPreferenceCommentCtrl', this.ModalPreferenceCommentCtrl = function($scope, $rootScope, $uibModalInstance, supportStaffFormActionCreators, state, preference) {
	$scope.state = state;
	$scope.preference = preference;

	$scope.submit = function () {
		supportStaffFormActionCreators.updatePreference($scope.state.misc.scheduleId, $scope.preference);

		$uibModalInstance.dismiss('cancel');
	};

	$scope.dismiss = function() {
		$uibModalInstance.dismiss('cancel');
	};
});