supportCallApp.controller('ModalContactSupportCallCtrl', this.ModalContactSupportCallCtrl = function($scope, $rootScope, $uibModalInstance, instructionalSupportCallStatusActionCreators, supportCallMode, scheduleId, state, year, termShortCode, selectedParticipants) {

	$scope.scheduleId = scheduleId;
	$scope.state = state;
	$scope.year = year;
	$scope.nextYear = parseInt(year) + 1;
	$scope.termShortCode = termShortCode;
	$scope.supportCallConfigData = {};
	$scope.supportCallConfigData.selectedParticipants = selectedParticipants;
	$scope.supportCallConfigData.dueDate = new Date();

	// Generate termCode
	if (termShortCode < 4) {
		$scope.supportCallConfigData.termCode = $scope.nextYear + $scope.termShortCode;
	} else {
		$scope.supportCallConfigData.termCode = $scope.year + $scope.termShortCode;
	}

	// Indicates which button started this support call: 'student' or 'instructor'
	$scope.supportCallConfigData.mode = supportCallMode;

	$scope.supportCallConfigData.dueDate;
	$scope.supportCallConfigData.rawDueDate;
	
	$scope.supportCallConfigData.message = "Please consider your preferences for next year. As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";

	$scope.formats = ['MMMM dd, yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
	$scope.format = $scope.formats[0];

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
		showWeeks: false,
		initDate: new Date()
	};

	$scope.popup1 = {};
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.submit = function () {
		var messageInput = $('.support-call-message-input').val();
		if (messageInput) {
			$scope.supportCallConfigData.message = messageInput.replace(/\r?\n/g, '<br />');
		}

		if ($scope.supportCallConfigData.mode == "instructor") {
			instructionalSupportCallStatusActionCreators.contactInstructorsSupportCall($scope.scheduleId, $scope.supportCallConfigData);
		} else {
			instructionalSupportCallStatusActionCreators.contactSupportStaffSupportCall($scope.scheduleId, $scope.supportCallConfigData);
		}

		$uibModalInstance.dismiss('cancel');
	};

	$scope.dismiss = function() {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.isFormIncomplete = function() {
		if (!$scope.supportCallConfigData.message || $scope.supportCallConfigData.message.length == 0) {
			return true;
		}

		return false;
	};
});