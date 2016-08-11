assignmentApp.controller('ModalUnavailabilityCtrl', this.ModalUnavailabilityCtrl = function($scope, $rootScope, $uibModalInstance, teachingCallResponses, termDisplayNames) {
	$scope.teachingCallResponses = teachingCallResponses;
	$scope.termDisplayNames = termDisplayNames;

	$scope.confirm = function () {
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});