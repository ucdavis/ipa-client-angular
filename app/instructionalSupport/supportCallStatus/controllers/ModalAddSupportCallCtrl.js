instructionalSupportApp.controller('ModalAddSupportCallCtrl', this.ModalAddSupportCallCtrl = function($scope, $rootScope, $uibModalInstance, instructionalSupportCallStatusActionCreators, supportCallMode, scheduleId, phdIds, mastersIds, instructionalSupportIds, instructionalSupportStaffs, year, nextYear) {

	$scope.year = year;
	$scope.nextYear = nextYear;

	$scope.phdPool = [];
	for(i = 0; i < phdIds.length; i++) {
		slotSupportStaffId = phdIds[i];
		slotSupportStaff = instructionalSupportStaffs.list[slotSupportStaffId];

		participant = {};
		participant.id = slotSupportStaff.id;
		participant.displayName = slotSupportStaff.fullName;
		participant.group = "phd";
		participant.enabled = true;

		$scope.phdPool.push(participant);
	}

	$scope.mastersPool = [];
	for(i = 0; i < mastersIds.length; i++) {
		slotSupportStaffId = mastersIds[i];
		slotSupportStaff = instructionalSupportStaffs.list[slotSupportStaffId];

		participant = {};
		participant.id = slotSupportStaff.id;
		participant.displayName = slotSupportStaff.fullName;
		participant.group = "masters";
		participant.enabled = true;

		$scope.mastersPool.push(participant);
	}

	$scope.instructionalSupportPool = [];
	for(i = 0; i < instructionalSupportIds.length; i++) {
		slotSupportStaffId = instructionalSupportIds[i];
		slotSupportStaff = instructionalSupportStaffs.list[slotSupportStaffId];

		participant = {};
		participant.id = slotSupportStaff.id;
		participant.displayName = slotSupportStaff.fullName;
		participant.group = "instructionalSupport";
		participant.enabled = true;

		$scope.instructionalSupportPool.push(participant);
	}

	$scope.instructorPool = [
		{id: 8, displayName: "Dave MacKinnon", group: "instructor", enabled: true},
		{id: 9, displayName: "Jenny Green", group: "instructor", enabled: true}
	];

	$scope.scheduleId = scheduleId;
	$scope.termCode = 10;

	$scope.supportCallConfigData = {displayPage: 6};
	$scope.supportCallConfigData.minimumNumberOfPreferences = 5;

	// Indicates which button started this support call: 'student' or 'instructor'
	$scope.supportCallConfigData.mode = supportCallMode;
	$scope.supportCallConfigData.sendEmails = true;

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

	$scope.toggleSendEmails = function () {
		if ($scope.supportCallConfigData.sendEmails) {
			$scope.supportCallConfigData.sendEmails = false;
		} else {
			$scope.supportCallConfigData.sendEmails = true;
		}
		console.log($scope.supportCallConfigData.sendEmails);
	};

	$scope.checkboxToggle = function () {
		console.log("testing");
		$scope.toggleSendEmails();
	}

	$scope.selectSendEmail = function () {
		$scope.supportCallConfigData.sendEmails = true;
	};

	$scope.selectNoEmail = function () {
		$scope.supportCallConfigData.sendEmails = false;
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

	$scope.setTermCode = function(fullTerm) {
		$scope.supportCallConfigData.termCode = fullTerm;
	};

	$scope.gotoConfigPage = function () {
		if ($scope.supportCallConfigData.instructorParticipants) {
			$scope.supportCallConfigData.displayPage = 4;
		} else {
			$scope.supportCallConfigData.displayPage = 2;
		}
	};

	$scope.gotoTermSelectionPage = function () {
		$scope.supportCallConfigData.displayPage = 6;
	};

	$scope.gotoUserSelectionPage = function () {
		$scope.supportCallConfigData.displayPage = 1;
	};

	$scope.gotoSummaryPage = function () {
		$scope.supportCallConfigData.dueDate = $scope.supportCallConfigData.rawDueDate.toISOString().slice(0, 10);
		if ($scope.supportCallConfigData.instructorParticipants) {
			$scope.supportCallConfigData.displayPage = 5;
		} else {
			$scope.supportCallConfigData.displayPage = 3;
		}
	};

	$scope.beginSupportCall = function () {
		instructionalSupportCallStatusActionCreators.addStudentSupportCall($scope.scheduleId, $scope.supportCallConfigData);

		$uibModalInstance.dismiss('cancel');
	};

	$scope.allTerms = ['01', '02', '03', '05', '06', '07', '08', '09', '10'];
	$scope.fullTerms = [];

	for (var i = 0; i < $scope.allTerms.length; i++) {
		shortTermCode = $scope.allTerms[i];

		if (parseInt(shortTermCode) > 4) {
			slotYear = $scope.year;
		} else {
			slotYear = parseInt($scope.year) + 1;
		}
		fullTerm = slotYear + shortTermCode;
		$scope.fullTerms.push(fullTerm);
	}

	$scope.getTermName = function(term) {
		var endingYear = "";
		if (term.length == 6) {
			endingYear = term.substring(0,4);
			term = term.slice(-2);
		}

		termNames = {
			'05': 'Summer Session 1',
			'06': 'Summer Special Session',
			'07': 'Summer Session 2',
			'08': 'Summer Quarter',
			'09': 'Fall Semester',
			'10': 'Fall Quarter',
			'01': 'Winter Quarter',
			'02': 'Spring Semester',
			'03': 'Spring Quarter'
		};

		return termNames[term] + " " + endingYear;
	};
});