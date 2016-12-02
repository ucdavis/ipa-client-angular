instructionalSupportApp.controller('ModalAddSupportCallCtrl', this.ModalAddSupportCallCtrl = function($scope, $rootScope, $uibModalInstance, instructionalSupportCallStatusActionCreators, supportCallMode) {
	$scope.phdPool = [
		{id: 1, displayName: "John Smith", group: "phd", enabled: true},
		{id: 2, displayName: "Jenny Garcia", group: "phd", enabled: true},
		{id: 3, displayName: "Lloyd Wheeler", group: "phd", enabled: true}
	];

	$scope.mastersPool = [
		{id: 4, displayName: "Bobbi Hale", group: "masters", enabled: true},
		{id: 5, displayName: "Jeremy Phillips", group: "masters", enabled: true}
	];

	$scope.instructionalSupportPool = [
		{id: 6, displayName: "Joel Dobris", group: "instructionalSupport", enabled: true},
		{id: 7, displayName: "Grant Wallace", group: "instructionalSupport", enabled: true}
	];

	$scope.instructorPool = [
		{id: 8, displayName: "Dave MacKinnon", group: "instructor", enabled: true},
		{id: 9, displayName: "Jenny Green", group: "instructor", enabled: true}
	];

	$scope.supportCallConfigData = {displayPage: 1};
	// Indicates which button started this support call: 'student' or 'instructor'
	$scope.supportCallConfigData.mode = supportCallMode;

	$scope.supportCallConfigData.dueDate;
	$scope.supportCallConfigData.rawDueDate;

	$scope.supportCallConfigData.emailMessage = "Please consider your preferences for next year. As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
	$scope.supportCallConfigData.phdParticipants = false;
	$scope.supportCallConfigData.mastersParticipants = false;
	$scope.supportCallConfigData.participantPool = [];

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
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
		$scope.supportCallConfigData.phdParticipants = false;
		$scope.supportCallConfigData.mastersParticipants = false;
		$scope.supportCallConfigData.instructionalSupportParticipants = false;

		removeGroupFromPool("phd");
		removeGroupFromPool("masters");
		removeGroupFromPool("instructionalSupport");

		if ($scope.supportCallConfigData.instructorParticipants) {
			$scope.supportCallConfigData.instructorParticipants = false;
			removeGroupFromPool("instructor");
		} else {
			$scope.supportCallConfigData.instructorParticipants = true;
			addGroupToPool("instructor");
		}
	};

	$scope.togglePhd = function () {
		$scope.supportCallConfigData.instructorParticipants = false;
		removeGroupFromPool("instructor");

		if ($scope.supportCallConfigData.phdParticipants) {
			$scope.supportCallConfigData.phdParticipants = false;
			removeGroupFromPool("phd");
		} else {
			$scope.supportCallConfigData.phdParticipants = true;
			addGroupToPool("phd");
		}
	};

	$scope.toggleMasters = function () {
		$scope.supportCallConfigData.instructorParticipants = false;
		removeGroupFromPool("instructor");

		if ($scope.supportCallConfigData.mastersParticipants) {
			$scope.supportCallConfigData.mastersParticipants = false;
			removeGroupFromPool("masters");
		} else {
			$scope.supportCallConfigData.mastersParticipants = true;
			addGroupToPool("masters");
		}
	};

	$scope.toggleInstructionalSupport = function () {
		$scope.supportCallConfigData.instructorParticipants = false;
		removeGroupFromPool("instructor");

		if ($scope.supportCallConfigData.instructionalSupportParticipants) {
			$scope.supportCallConfigData.instructionalSupportParticipants = false;
			removeGroupFromPool("instructionalSupport");
		} else {
			$scope.supportCallConfigData.instructionalSupportParticipants = true;
			addGroupToPool("instructionalSupport");
		}
	};

	// Looks in the current participant pool for any individuals from the specified group, and removes them
	removeGroupFromPool = function (participantGroup) {
		for (var i = $scope.supportCallConfigData.participantPool.length - 1; i >= 0; i--) {
			var participant = $scope.supportCallConfigData.participantPool[i];

			if (participant.group == participantGroup) {
				$scope.supportCallConfigData.participantPool.splice(i, 1);
			}
		}
	};

	// Adds all users in the specified group to the participant pool
	addGroupToPool = function (participantGroup) {
		var groupToAdd = {};

		switch(participantGroup) {
			case "phd":
				groupToAdd = $scope.phdPool;
				break;
			case "masters":
				groupToAdd = $scope.mastersPool;
				break;
			case "instructionalSupport":
				groupToAdd = $scope.instructionalSupportPool;
				break;
			case "instructor":
				groupToAdd = $scope.instructorPool;
				break;
		}

		for (var i = 0; i < groupToAdd.length; i++) {
			var participant = groupToAdd[i];
			participant.enabled = true;
			$scope.supportCallConfigData.participantPool.push(participant);
		}
	};

	$scope.toggleEnabled = function (participant) {
		if (participant.enabled) {
			participant.enabled = false;
		} else {
			participant.enabled = true;
		}
	};

	$scope.toggleReaderPreferences = function () {
		if ($scope.supportCallConfigData.collectReaderPreferences) {
			$scope.supportCallConfigData.collectReaderPreferences = false;
		} else {
			$scope.supportCallConfigData.collectReaderPreferences = true;
		}
	};

	$scope.toggleAIPreferences = function () {
		if ($scope.supportCallConfigData.collectAIPreferences) {
			$scope.supportCallConfigData.collectAIPreferences = false;
		} else {
			$scope.supportCallConfigData.collectAIPreferences = true;
		}
	};

	$scope.toggleTAPreferences = function () {
		if ($scope.supportCallConfigData.collectTAPreferences) {
			$scope.supportCallConfigData.collectTAPreferences = false;
		} else {
			$scope.supportCallConfigData.collectTAPreferences = true;
		}
	};

	$scope.gotoConfigPage = function () {
		if ($scope.supportCallConfigData.instructorParticipants) {
			$scope.supportCallConfigData.displayPage = 4;
		} else {
			$scope.supportCallConfigData.displayPage = 2;
		}
	}

	$scope.gotoUserSelectionPage = function () {
		$scope.supportCallConfigData.displayPage = 1;
	}

	$scope.gotoSummaryPage = function () {
		$scope.supportCallConfigData.dueDate = $scope.supportCallConfigData.rawDueDate.toISOString().slice(0, 10);
		if ($scope.supportCallConfigData.instructorParticipants) {
			$scope.supportCallConfigData.displayPage = 5;
		} else {
			$scope.supportCallConfigData.displayPage = 3;
		}
	}

	$scope.beginSupportCall = function () {
		instructionalSupportCallStatusActionCreators.addStudentSupportCall(20, $scope.supportCallConfigData);
	}
});