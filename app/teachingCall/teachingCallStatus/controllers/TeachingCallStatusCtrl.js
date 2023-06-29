import 'TeachingCall/css/teaching-call-status.css';

class TeachingCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $route, $routeParams, TeachingCallStatusActionCreators, TeachingCallStatusService, AuthService, validate) {
		this.AuthService = AuthService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.TeachingCallStatusActionCreators = TeachingCallStatusActionCreators;
		this.TeachingCallStatusService = TeachingCallStatusService;
		this.AuthService = AuthService;

		$scope.modalStyles = { "width" : "75%" };
		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$window.document.title = "Teaching Call Status";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {
			year: $scope.year,
			workgroupId: $scope.workgroupId
		};
		$scope.isActivityLogOpen = false;

		$rootScope.$on('teachingCallStatusStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$scope.instructorFormHasData = function(instructor) {
			// Is message set?
			if (instructor.message) { return true; }

			// Are instructor preferences set?
			var teachingAssignments = $scope.view.state.teachingAssignments.byInstructorId[instructor.instructorId] || [];

			var hasData = false;

			teachingAssignments.forEach(function(teachingAssignment) {
				if (teachingAssignment.fromInstructor) { hasData = true; }
			});

			if (hasData) { return true; }

			// Is unavailability set?
			var teachingCallResponses = $scope.view.state.teachingCallResponses.byInstructorId[instructor.instructorId] || [];

			teachingCallResponses.forEach(function(teachingCallResponse) {
				if (teachingCallResponse.availabilityBlob.indexOf("0") > -1) { hasData = true; }
			});

			return hasData;
		};

		$scope.toggleInstructor = function(instructor) {
			TeachingCallStatusActionCreators.toggleInstructor(instructor.instructorId);
		};

		$scope.instructorIsSelected = function(instructorId) {
			return $scope.view.state ? $scope.view.state.ui.selectedInstructorIds.indexOf(instructorId) > -1 : false;
		};

		$scope.areAllInstructorsOfTypeSelected = function(instructorTypeId) {
			var allInstructorsAlreadyToggled = true;

			$scope.view.state.calculations.teachingCallsByInstructorType[instructorTypeId].forEach(function(instructor) {
				if ($scope.instructorIsSelected(instructor.instructorId) == false) {
					allInstructorsAlreadyToggled = false;
				}
			});

			return allInstructorsAlreadyToggled;
		};

		$scope.toggleInstructorType = function(instructorTypeId) {
			var allInstructorsAlreadyToggled = $scope.areAllInstructorsOfTypeSelected(instructorTypeId);

			if (allInstructorsAlreadyToggled) {
				TeachingCallStatusActionCreators.unSelectInstructorsByType(instructorTypeId);
			} else {
				TeachingCallStatusActionCreators.selectInstructorsByType(instructorTypeId);
			}
		};

		$scope.atLeastOneInstructorSelected = function() {
			return $scope.view.state ? $scope.view.state.ui.selectedInstructorIds.length > 0 : false;
		};

		// Launches Contact Instructor Modal
		$scope.openContactInstructorsModal = function() {
			$scope.view.state.openContactInstructorModal = true;
		};

		// Launches Call Instructor Modal
		$scope.openAddInstructorsModal = function() {
			$scope.view.state.openCallInstructorModal = true;
		};

		$scope.removeInstructor = function(instructor) {
			TeachingCallStatusActionCreators.removeInstructorFromTeachingCall($scope.workgroupId, $scope.year, instructor);
		};

		$scope.toggleActivityLogOpen = function() {
			TeachingCallStatusService.getAuditLogs($scope.workgroupId, $scope.year).then(res => {
				$scope.auditLogs = res;
			});
			return $scope.isActivityLogOpen = !$scope.isActivityLogOpen;
		};

		$scope.lockTeachingCalls = function() {
			TeachingCallStatusActionCreators.lockTeachingCalls($scope.workgroupId, $scope.year, $scope.view.state.ui.selectedInstructorIds);
		};

		$scope.unlockTeachingCall = function(teachingCall) {
			TeachingCallStatusActionCreators.unlockTeachingCall(teachingCall.id);
		};
	}
}

TeachingCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$route', '$routeParams', 'TeachingCallStatusActionCreators', 'TeachingCallStatusService', 'AuthService', 'validate'];

export default TeachingCallStatusCtrl;
