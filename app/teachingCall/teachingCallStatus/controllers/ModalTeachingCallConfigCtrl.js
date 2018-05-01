teachingCallApp.controller('ModalTeachingCallConfigCtrl', this.ModalTeachingCallConfigCtrl = function($scope, $rootScope, $uibModalInstance, scheduleYear, viewState, workgroupId, allTerms) {
	$scope.startTeachingCallConfig = {};
	$scope.startTeachingCallConfig.sentToFederation = false;
	$scope.startTeachingCallConfig.sentToSenate = false;
	$scope.startTeachingCallConfig.dueDate = "";
	$scope.startTeachingCallConfig.showUnavailabilities = true;
	$scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
	$scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
	$scope.startTeachingCallConfig.emailInstructors = true;
	$scope.year = scheduleYear;
	$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);


	// TODO: test data, remove

	$scope.activeTermIds = [];

	$scope.view = {};
	$scope.viewState = viewState;
	$scope.viewState.showPage1 = true;
	$scope.scheduleYear = scheduleYear;
	$scope.workgroupId = workgroupId;

	$scope.minDate = new Date();
	$scope.parent = {dueDate:''};

	$scope.startTeachingCallConfig.activeTerms = {};
	$scope.allTerms = allTerms;
	$scope.displayedFormPage = 1;

	allTerms = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'];
	var i;
	for (i = 0; i < allTerms.length; i++) {
		$scope.startTeachingCallConfig.activeTerms[allTerms[i]] = false;
	}

	// Use schedule data to pre-select terms in TeachingCall creation form
	for (i = 0; i < $scope.viewState.scheduleTermStates.ids.length; i++) {
		var termCode = $scope.viewState.scheduleTermStates.ids[i];
		var term = String(termCode).slice(-2);
		$scope.startTeachingCallConfig.activeTerms[term] = true;
	}

	// If schedule had no terms, default to pre-select SS1,SS2,F,W,S in TeachingCall creation form
	if ($scope.viewState.scheduleTermStates.ids.length === 0) {
		$scope.startTeachingCallConfig.activeTerms['05'] = true;
		$scope.startTeachingCallConfig.activeTerms['07'] = true;
		$scope.startTeachingCallConfig.activeTerms['01'] = true;
		$scope.startTeachingCallConfig.activeTerms['03'] = true;
		$scope.startTeachingCallConfig.activeTerms['10'] = true;
	}

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

	$scope.isFormIncomplete = function () {
		if ($scope.startTeachingCallConfig.dueDate !== "" && $scope.startTeachingCallConfig.message !== "") {
			if ($scope.startTeachingCallConfig.sentToFederation || $scope.startTeachingCallConfig.sentToSenate) {
				return false;
			}
		}
		return true;
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

	$scope.createWithoutEmail = function() {
		$scope.startTeachingCallConfig.emailInstructors = false;
		$scope.startTeachingCallConfig.message = "";
		$uibModalInstance.close($scope.startTeachingCallConfig);
	};

	$scope.createAndEmail = function() {
		$scope.startTeachingCallConfig.emailInstructors = true;
		$scope.startTeachingCallConfig.message = $scope.startTeachingCallConfig.messageSummary;
		$uibModalInstance.close($scope.startTeachingCallConfig);
	};

	$scope.showPageTwo = function() {
		$scope.viewState.showPage1=false;
		var messageInput = $('.teaching-call-message-input').val();
		$scope.startTeachingCallConfig.messageSummary = messageInput.replace(/\r?\n/g, '<br />');
	};

	// Generate the teachingCall root url
	// example: http://localhost:9000/teachingCalls/10/2012/

	$scope.urlRoot = location.href;
	var splitUrl = $scope.urlRoot.split('/');
	var endOfUrl = splitUrl[splitUrl.length-1];
	$scope.urlRoot = $scope.urlRoot.replace(endOfUrl, '');
});
