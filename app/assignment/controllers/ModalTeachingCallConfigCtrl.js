assignmentApp.controller('ModalTeachingCallConfigCtrl', this.ModalTeachingCallConfigCtrl = function($scope, $rootScope, $uibModalInstance, scheduleYear, viewState, workgroupId, allTerms) {
	$scope.startTeachingCallConfig = {};
	$scope.startTeachingCallConfig.sentToFederation = false;
	$scope.startTeachingCallConfig.sentToSenate = false;
	$scope.startTeachingCallConfig.dueDate = "";
	$scope.startTeachingCallConfig.showUnavailabilities = true;
	$scope.startTeachingCallConfig.message = "Please consider your teaching for next year in light of what you have taught in recent years.";
	$scope.startTeachingCallConfig.message += " As always, we will attempt to accommodate your requests, but we may need to ask some of you to make changes in order to balance our course offerings effectively.";
	$scope.startTeachingCallConfig.emailInstructors = true;

	$scope.view = {};
	$scope.viewState = viewState;
	console.log("viewstate");
	console.log(viewState);
	$scope.scheduleYear = scheduleYear;
	$scope.eligibleGroupsForTeachingCall = viewState.teachingCalls.eligibleGroupsForTeachingCall;
	$scope.workgroupId = workgroupId;

	$scope.senate = $scope.viewState.teachingCalls.eligibleGroups.senateInstructors;
	$scope.federation = $scope.viewState.teachingCalls.eligibleGroups.federationInstructors;

	$scope.minDate = new Date();
	$scope.parent = {dueDate:''};

	$scope.senateInstructors = {};
	$scope.federationInstructors = {};

	$scope.startTeachingCallConfig.activeTerms = {};
	$scope.allTerms = allTerms;
	$scope.displayedFormPage = 1;

	for (var i = 0; i < $scope.allTerms.length; i++) {
		$scope.startTeachingCallConfig.activeTerms[$scope.allTerms[i]] = false;
	}

	// Use schedule data to pre-select terms in TeachingCall creation form
	for (var i = 0; i < $scope.viewState.scheduleTermStates.ids.length; i++) {
		var termCode = $scope.viewState.scheduleTermStates.ids[i];
		var term = String(termCode).slice(-2);
		$scope.startTeachingCallConfig.activeTerms[term] = true;
	}

	// If schedule had no terms, default to pre-select SS1,SS2,F,W,S in TeachingCall creation form
	if ($scope.viewState.scheduleTermStates.ids.length == 0) {
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
		if ($scope.startTeachingCallConfig.dueDate != "" && $scope.startTeachingCallConfig.message != "") {
			if ($scope.startTeachingCallConfig.sentToFederation || $scope.startTeachingCallConfig.sentToSenate) {
				return false;
			}
		}
		return true;
	}

	$scope.getWorkgroupUserRoles = function () {
		userService.getWorkgroupUserRoles($scope.workgroupId).then(function(data) {
			$scope.senateInstructors = data.senateUsers;
			$scope.federationInstructors = data.federationUsers;
		}, function(data) {
			console.error("Error obtaining Workgroup Users");
		});

	};

	// Transforms to ISO format
	$scope.saveDueDate = function () {
		if ($scope.parent.dueDate != "") {
			$scope.startTeachingCallConfig.dueDate =  $scope.parent.dueDate.toISOString().slice(0, 10);
		}
	}

	$scope.isTermActive = function(term) {
		if ($scope.startTeachingCallConfig.activeTerms != null) {
			return $scope.startTeachingCallConfig.activeTerms[term];
		}

		return false;
	}

	$scope.toggleTermActive = function(term) {
		$scope.startTeachingCallConfig.activeTerms[term] = !$scope.startTeachingCallConfig.activeTerms[term];
	}

	$scope.getTermName = function(term) {
		return termService.getTermName(term);
	}

	$scope.activeTermsDescription = function() {
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
	}

	$scope.getWorkgroupUserRoles();
});