/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ModalAddInstructorsCtrl
 * @description
 * # ModalAddInstructorsCtrl
 * Controller of the ipaClientAngularApp
 */
teachingCallApp.controller('ModalAddInstructorsCtrl', ['$scope', '$rootScope', '$uibModalInstance', 'scheduleYear', 'workgroupId', 'state', 'termService',
	this.ModalAddInstructorsCtrl = function($scope, $rootScope, $uibModalInstance, scheduleYear, workgroupId, state, termService) {
	
	$scope.startTeachingCallConfig = {};
	$scope.startTeachingCallConfig.dueDate = "";
	$scope.startTeachingCallConfig.showUnavailabilities = true;
	$scope.startTeachingCallConfig.sendEmail = true;
	$scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
	$scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";

	$scope.year = scheduleYear;
	$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
	$scope.instructorTypes = state.instructorTypes;

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

	$scope.startTeachingCallConfig.invitedInstructors = state.calculations.instructorsEligibleForCall;
	$scope.startTeachingCallConfig.invitedInstructors = _array_sortByProperty($scope.startTeachingCallConfig.invitedInstructors, "lastName");

	$scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
		instructor.invited = false;
	});

	$scope.instructorTypeUsed = function(instructorTypeId) {
		var atLeastOneInstructor = false;

		if ($scope.startTeachingCallConfig.invitedInstructors) {
			$scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
				if(instructor.instructorTypeId == instructorTypeId) {
					atLeastOneInstructor = true;
				}
			});
		}

		return atLeastOneInstructor;
	};

	$scope.inviteInstructorsOfType = function (instructorTypeId) {
		$scope.startTeachingCallConfig.invitedInstructors.forEach(function(instructor) {
			if(instructor.instructorTypeId == instructorTypeId) {
				instructor.invited = true;
			}
		});

		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.allInstructorTypeInvited = function (instructorTypeId) {
		var excludedInstructors = $scope.startTeachingCallConfig.invitedInstructors.find(function(instructor) {
			return ((instructor.instructorTypeId == instructorTypeId) && (instructor.invited == false));
		});

		return !(excludedInstructors);
	};

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

	$scope.toggleInstructor = function(instructor) {
		instructor.invited = !instructor.invited;
		$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
	};

	$scope.toggleSendEmail = function() {
		$scope.startTeachingCallConfig.sendEmail = !$scope.startTeachingCallConfig.sendEmail;
	};

	$scope.getTermName = function(term) {
		return termService.getTermName(term);
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

	$scope.startTeachingCallConfig.isAddInstructorFormComplete = $scope.isAddInstructorFormComplete();
}]);
