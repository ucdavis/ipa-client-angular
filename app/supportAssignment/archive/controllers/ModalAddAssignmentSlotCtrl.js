supportAssignmentApp.controller('ModalAddAssignmentSlotCtrl', this.ModalAddAssignmentSlotCtrl = function($scope, $rootScope, $uibModalInstance, instructionalSupportAssignmentActionCreators, sectionGroupId, appointmentType) {
	$scope.title = generateTitle($scope.appointmentType);
	$scope.formData = {appointmentPercentage: 50, numberOfAppointments: 1};

	$scope.addAssignmentSlots = function () {
		instructionalSupportAssignmentActionCreators.addAssignmentSlots(
			appointmentType,
			$scope.formData.appointmentPercentage,
			$scope.formData.numberOfAppointments,
			sectionGroupId);

		$uibModalInstance.dismiss('cancel');
	};

	function generateTitle (appointmentType) {
		switch (appointmentType) {
			case "teachingAssistant":
				return "Teaching Assistant";
			case "reader":
				return "Reader";
			case "associateInstructor":
				return "Associate Instructor";
			default:
				return "";
		}
	}

	$scope.dismiss = function () {
		$uibModalInstance.dismiss('cancel');
	};
});
