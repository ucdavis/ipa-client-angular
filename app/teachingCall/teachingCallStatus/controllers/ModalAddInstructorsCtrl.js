teachingCallApp.controller('ModalAddInstructorsCtrl', this.ModalAddInstructorsCtrl = function($scope, $rootScope, $uibModalInstance, scheduleYear, workgroupId, state) {
	$scope.startTeachingCallConfig = {};
	$scope.startTeachingCallConfig.dueDate = "";
	$scope.startTeachingCallConfig.showUnavailabilities = true;
	$scope.startTeachingCallConfig.sendEmail = true;
	$scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
	$scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";

	$scope.year = scheduleYear;
	$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);

	$scope.allTerms = {
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

	$scope.senateGroup = angular.copy(state.eligible.senate);
	$scope.federationGroup = angular.copy(state.eligible.federation);
	$scope.lecturerGroup = angular.copy(state.eligible.lecturer);

	$scope.startTeachingCallConfig.invitedInstructors = $scope.senateGroup.concat($scope.federationGroup);
	$scope.startTeachingCallConfig.invitedInstructors = $scope.startTeachingCallConfig.invitedInstructors.concat($scope.lecturerGroup);
	$scope.startTeachingCallConfig.invitedInstructors = _array_sortByProperty($scope.startTeachingCallConfig.invitedInstructors, "lastName");

	$scope.startTeachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
		slotInstructor.invited = false;
	});

	$scope.activeTermIds = [];

	$scope.view = {};

	$scope.scheduleYear = scheduleYear;
	$scope.workgroupId = workgroupId;

	$scope.minDate = new Date();
	$scope.parent = {dueDate:''};

	$scope.senateInstructors = {};
	$scope.federationInstructors = {};
	$scope.lecturerInstructors = {};

	$scope.startTeachingCallConfig.activeTerms = {};

	allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];

	for (var i = 0; i < allTerms.length; i++) {
		$scope.startTeachingCallConfig.activeTerms[allTerms[i]] = false;
	}

	chronologicalTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
	$scope.dropDownTerms = [];
	for (var i = 0; i < chronologicalTerms.length; i++) {
		var shortTerm = chronologicalTerms[i];
		var slotTerm = "";
		if (parseInt(shortTerm) < 5) {
			slotTerm = parseInt($scope.year) + 1;
		} else {
			slotTerm = $scope.year;
		}

		slotTerm += shortTerm;
		$scope.dropDownTerms.push(slotTerm);
	}

	$scope.startTeachingCallConfig.activeTerms['01'] = true;
	$scope.startTeachingCallConfig.activeTerms['03'] = true;
	$scope.startTeachingCallConfig.activeTerms['10'] = true;

	$scope.open = function($event, id, type) {
		$event.preventDefault();
		$event.stopPropagation();
		$scope.opened  = {start: false, end: false};
		if(type == 'start') {
			$scope.opened.start = true;
		}
		if(type == 'end') {
			$scope.opened[id].end = true;
		}
	};

	$scope.start = function (emailInstructors) {
		$scope.startTeachingCallConfig.emailInstructors = emailInstructors;
		$uibModalInstance.close($scope.startTeachingCallConfig);
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

	$scope.isAddInstructorFormComplete = function () {
		var atLeastOneInstructor = false;
		var atLeastOneTerm = false;

		$scope.startTeachingCallConfig.invitedInstructors.forEach( function(slotInstructor) {
			if (slotInstructor.invited == true) {
				atLeastOneInstructor = true;
			}
		});

		Object.keys($scope.startTeachingCallConfig.activeTerms).forEach(function (key) { 
				var value = $scope.startTeachingCallConfig.activeTerms[key];
				if (value == true) {
					atLeastOneTerm = true;
				}
		});

		return atLeastOneInstructor && atLeastOneTerm;
	};

	// Transforms to ISO format
	$scope.saveDueDate = function () {
		if ($scope.parent.dueDate !== "") {
			$scope.startTeachingCallConfig.dueDate = $scope.parent.dueDate.toISOString().slice(0, 10);
		}
	};

	$scope.isTermActive = function (term) {
		if ($scope.startTeachingCallConfig.activeTerms != null) {
			return $scope.startTeachingCallConfig.activeTerms[term];
		}

		return false;
	};

	$scope.toggleTermActive = function (term) {
		term = term.slice(-2);
		$scope.startTeachingCallConfig.activeTerms[term] = !$scope.startTeachingCallConfig.activeTerms[term];
		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.activeTermsDescription = function () {
		var description = "";

		for (var i = 0; i < $scope.allTerms.length; i++) {
			if ($scope.startTeachingCallConfig.activeTerms && $scope.startTeachingCallConfig.activeTerms[$scope.allTerms[i]]) {
				if (description.length > 0) {
					description += ", ";
				}
				description += $scope.getTermName($scope.allTerms[i]);
			}
		}

		return description;
	};

	$scope.addSenateInstructors = function () {
		$scope.startTeachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
			if(slotInstructor.isSenateInstructor) {
				slotInstructor.invited = true;
			}
		});

		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.areAllSenateInvited = function() {
		if (!$scope.startTeachingCallConfig.invitedInstructors) {
			return true;
		}

		var uninvitedInstructor = $scope.startTeachingCallConfig.invitedInstructors.find( slotInstructor => {
			return slotInstructor.isLecturerInstructor && !slotInstructor.invited;
		});

		if(uninvitedInstructor) { return false; }

		return true;
	};

	$scope.areAllFederationInvited = function() {
		if (!$scope.startTeachingCallConfig.invitedInstructors) {
			return true;
		}

		var uninvitedInstructor = $scope.startTeachingCallConfig.invitedInstructors.find( slotInstructor => {
			return slotInstructor.isFederationInstructor && !slotInstructor.invited;
		});

		if(uninvitedInstructor) { return false; }

		return true;
	};

	$scope.areAllLecturersInvited = function() {
		if (!$scope.startTeachingCallConfig.invitedInstructors) {
			return true;
		}

		var uninvitedInstructor = $scope.startTeachingCallConfig.invitedInstructors.find( slotInstructor => {
			return slotInstructor.isLecturerInstructor && !slotInstructor.invited;
		});

		if(uninvitedInstructor) { return false; }

		return true;
	};

	$scope.addLecturerInstructors = function () {
		$scope.startTeachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
			if(slotInstructor.isLecturerInstructor) {
				slotInstructor.invited = true;
			}
		});

		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.addFederationInstructors = function () {
		$scope.startTeachingCallConfig.invitedInstructors.forEach(function(slotInstructor) {
			if(slotInstructor.isFederationInstructor) {
				slotInstructor.invited = true;
			}
		});

		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.toggleInstructor = function(instructor) {
		instructor.invited = !instructor.invited;
		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.toggleSendEmail = function() {
		$scope.startTeachingCallConfig.sendEmail = !$scope.startTeachingCallConfig.sendEmail;
	};

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

	// Datepicker config
	$scope.inlineOptions = {
		minDate: new Date(),
		showWeeks: true
	};

	$scope.dateOptions = {
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1,
		showWeeks: false
	};

	$scope.popup1 = {};
	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};

	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
	$scope.format = $scope.formats[4];
	$scope.altInputFormats = ['M!/d!/yyyy'];

	$scope.submit = function() {
		var messageInput = $('.teaching-call-message-input').val();
		if (messageInput) {
			$scope.startTeachingCallConfig.message = messageInput.replace(/\r?\n/g, '<br />');
		}

		$uibModalInstance.close($scope.startTeachingCallConfig);
	};

	$scope.termDescriptions = function () {
		$scope.startTeachingCallConfig.activeTerms;
		// Convert termsBlob to terms
		var allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09','10'];
		var relevantTerms = [];

		allTerms.forEach( function(term) {
			$scope.startTeachingCallConfig;
			if ($scope.startTeachingCallConfig.activeTerms && $scope.startTeachingCallConfig.activeTerms[term]) {
				relevantTerms.push(term);
			}
		});

		// sort terms Chronologically
		var chronologicallyOrderedTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
		var sortedTerms = [];
		chronologicallyOrderedTerms.forEach( function(term) {
			if (relevantTerms.indexOf(term) > -1) {
				sortedTerms.push(term);
			}
		});
		// Convert termCodes to term descriptions
		allTermDescriptions = {
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

		// Comma Separated term descriptions
		termDescriptions = "";
		firstTerm = true;
		sortedTerms.forEach(function(term) {

			if (firstTerm) {
				termDescriptions += allTermDescriptions[term];
				firstTerm = false;
			} else {
				termDescriptions += ", ";
				termDescriptions += allTermDescriptions[term];
			}
		});

		return termDescriptions;
	};

	$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
});