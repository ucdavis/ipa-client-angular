instructionalSupportApp.controller('ModalAddSupportCallCtrl', this.ModalAddSupportCallCtrl = function(
	$scope, $rootScope, $uibModalInstance, instructionalSupportCallStatusActionCreators,
	supportCallMode, scheduleId, state, year, nextYear, termShortCode) {

	$scope.scheduleId = scheduleId;
	$scope.state = state;
	$scope.year = year;
	$scope.nextYear = nextYear;
	$scope.termShortCode = termShortCode;
	$scope.supportCallConfigData = {};

	$scope.supportCallConfigData.minimumNumberOfPreferences = 5;

	// Indicates which button started this support call: 'student' or 'instructor'
	$scope.supportCallConfigData.mode = supportCallMode;
	$scope.supportCallConfigData.sendEmails = true;

	$scope.supportCallConfigData.dueDate;
	$scope.supportCallConfigData.rawDueDate;
	
	$scope.supportCallConfigData.emailMessage = "Please consider your preferences for next year. As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";

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

	// Populate participantPool
	$scope.supportCallConfigData.participantPool = [];

	if ($scope.supportCallConfigData.mode = "instructor") {
		$scope.supportCallConfigData.participantPool = $scope.state.eligible.instructors;
	} else {
		$scope.supportCallConfigData.participantPool = $scope.state.eligible.supportStaff;
	}

	$scope.toggleSendEmails = function () {
		if ($scope.supportCallConfigData.sendEmails) {
			$scope.supportCallConfigData.sendEmails = false;
		} else {
			$scope.supportCallConfigData.sendEmails = true;
		}
	};

	$scope.checkboxToggle = function () {
		$scope.toggleSendEmails();
	};

	$scope.selectSendEmail = function () {
		$scope.supportCallConfigData.sendEmails = true;
	};

	$scope.selectNoEmail = function () {
		$scope.supportCallConfigData.sendEmails = false;
	};

	$scope.toggleInstructor = function () {
		// Ensure student groups are not part of this support Call if instructors are selected
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

	$scope.toggleParticipant = function (participant) {
		if (participant.invited) {
			participant.invited = false;
		} else {
			participant.invited = true;
		}
	};

	$scope.areAllInstructorsInvited = function() {
		$scope.supportCallConfigData.participantPool.forEach( function(participant) {
			invitedInstructors = 0;
		
			if (participant.invited && participant.isInstructor) {
				invitedInstructors++;
			}
		});

		if (invitedInstructors == $scope.state.eligible.instructors.length) {
			debugger;
			return true;
		}

		return false;
	};

	$scope.inviteInstructors = function() {
		$scope.supportCallConfigData.participantPool.forEach( function(participant) {
			if (participant.isInstructor) {
				participant.invited = true;
			}
		});
	}

	$scope.areAllMastersInvited = function() {
		
	};

	$scope.areAllPhdInvited = function() {
		
	};

	$scope.areAllInstructionalSupportInvited = function() {
		
	};

	$scope.setTermCode = function(fullTerm) {
		$scope.supportCallConfigData.termCode = fullTerm;
	};

	$scope.beginSupportCall = function () {
		if ($scope.supportCallConfigData.mode == "instructor") {
			instructionalSupportCallStatusActionCreators.addInstructorSupportCall($scope.scheduleId, $scope.supportCallConfigData);
		} else {
			instructionalSupportCallStatusActionCreators.addStudentSupportCall($scope.scheduleId, $scope.supportCallConfigData);
		}

		$uibModalInstance.dismiss('cancel');
	};

	$scope.calculateInstructorPool = function () {
		$scope.instructorPool = [];

		var shortTermCode = $scope.supportCallConfigData.termCode.slice(-2);

		instructorsByShortTermCode[shortTermCode].forEach( function (instructorId) {
			var instructor = instructors.list[instructorId];

			participant = {};
			participant.id = instructor.id;
			participant.displayName = instructor.fullName;
			participant.group = "instructor";
			participant.enabled = true;

			$scope.instructorPool.push(participant);
		});
	};

	$scope.isTermSelectionValid = function() {
		// Ensure termcode is set
		if (!$scope.supportCallConfigData.termCode) {
			return false;
		}

		return true;
	};

	$scope.isUserSelectionValid = function() {
		// Ensure at least one participant is set
		if(!$scope.supportCallConfigData.participantPool || $scope.supportCallConfigData.participantPool.length == 0) {
			return false;
		}

		// Ensure at least one participant is enabled
		for (var i = 0; i < $scope.supportCallConfigData.participantPool.length; i++) {
			var participant = $scope.supportCallConfigData.participantPool[i];

			if (participant.enabled) {
				return true;
			}
		}

		return false;
	};

	$scope.isStudentConfigValid = function() {
		// Ensure at least one preference type is set
		if(!$scope.supportCallConfigData.collectAIPreferences
			&& !$scope.supportCallConfigData.collectReaderPreferences
			&& !$scope.supportCallConfigData.collectTAPreferences) {
			return false;
		}

		// Ensure a date is set
		if(!$scope.supportCallConfigData.dueDate
		&& !$scope.supportCallConfigData.rawDueDate) {
			return false;
		}

		return true;
	};

	$scope.isInstructorConfigValid = function() {
		return true;
	};

	$scope.allTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
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