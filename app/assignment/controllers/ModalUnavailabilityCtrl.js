class ModalUnavailabilityCtrl {
	constructor ($scope, $rootScope, $uibModalInstance, AssignmentActionCreators, teachingCallResponses, termDisplayNames, instructor) {
		$scope.teachingCallResponses = teachingCallResponses;
		$scope.termDisplayNames = termDisplayNames;
		$scope.instructor = instructor;
	
		$scope.confirm = function () {
			$uibModalInstance.close();
		};
	
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	
		$scope.saveUnavailabilities = function (teachingCallResponse, blob) {
			teachingCallResponse.availabilityBlob = blob;
			assignmentActionCreators.updateTeachingCallResponse(teachingCallResponse);
		};
	}
}

ModalUnavailabilityCtrl.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'AssignmentActionCreators', 'teachingCallResponses', 'termDisplayNames', 'instructor'];

export default ModalUnavailabilityCtrl;
