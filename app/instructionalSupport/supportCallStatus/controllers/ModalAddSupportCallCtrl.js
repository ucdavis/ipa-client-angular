instructionalSupportApp.controller('ModalAddSupportCallCtrl', this.ModalAddSupportCallCtrl = function($scope, $rootScope, $uibModalInstance, instructionalSupportAssignmentActionCreators, sectionGroupId, appointmentType) {

	$scope.supportCallConfigData = {mode: "instructor", displayPage: 1};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
	$scope.format = $scope.formats[4];

	// Datepicker config
	$scope.inlineOptions = {
		minDate: new Date(),
		showWeeks: false
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1,
		showWeeks: false
	};

	$scope.submitSupportCall = function () {
		instructionalSupportAssignmentActionCreators.addAssignmentSlots(
			appointmentType,
			$scope.formData.appointmentPercentage,
			$scope.formData.numberOfAppointments,
			sectionGroupId);

		$uibModalInstance.dismiss('cancel');
	};

	$scope.toggleInstructor = function () {
		$scope.supportCallConfigData.instructorParticipants = true;

		$scope.supportCallConfigData.phdParticipants = false;
		$scope.supportCallConfigData.mastersParticipants = false;
		$scope.supportCallConfigData.instructionalSupportParticipants = false;
	};

	$scope.togglePhd = function () {
		$scope.supportCallConfigData.instructorParticipants = false;

		if ($scope.supportCallConfigData.phdParticipants) {
			$scope.supportCallConfigData.phdParticipants = false;
		} else {
			$scope.supportCallConfigData.phdParticipants = true;
		}
	};

	$scope.toggleMasters = function () {
		$scope.supportCallConfigData.instructorParticipants = false;

		if ($scope.supportCallConfigData.mastersParticipants) {
			$scope.supportCallConfigData.mastersParticipants = false;
		} else {
			$scope.supportCallConfigData.mastersParticipants = true;
		}
	};

	$scope.toggleInstructionalSupport = function () {
		$scope.supportCallConfigData.instructorParticipants = false;

		if ($scope.supportCallConfigData.instructionalSupportParticipants) {
			$scope.supportCallConfigData.instructionalSupportParticipants = false;
		} else {
			$scope.supportCallConfigData.instructionalSupportParticipants = true;
		}
	};

});