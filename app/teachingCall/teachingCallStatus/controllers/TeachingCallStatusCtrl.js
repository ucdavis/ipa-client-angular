import 'TeachingCall/css/teaching-call-status.css';

class TeachingCallStatusCtrl {
	constructor ($scope, $rootScope, $window, $route, $routeParams, TeachingCallStatusActionCreators, TeachingCallStatusService, CourseService, AuthService) {
		this.AuthService = AuthService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.TeachingCallStatusActionCreators = TeachingCallStatusActionCreators;
		this.TeachingCallStatusService = TeachingCallStatusService;
		this.CourseService = CourseService;
		this.AuthService = AuthService;

		$scope.modalStyles = { "width" : "75%" };

		$window.document.title = "Teaching Call Status";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
		$scope.view = {
			year: $scope.year,
			workgroupId: $scope.workgroupId
		};

		$rootScope.$on('teachingCallStatusStateChanged', function (event, data) {
			$scope.view.state = data;

			CourseService.getScheduleByWorkgroupIdAndYear($scope.workgroupId, $scope.year)
				.then(function (res) {
					$scope.view.state.scheduleHasCourses = (res.courses.length === 0);
				});
		});

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
	}
}

TeachingCallStatusCtrl.$inject = ['$scope', '$rootScope', '$window', '$route', '$routeParams', 'TeachingCallStatusActionCreators', 'TeachingCallStatusService', 'CourseService', 'AuthService'];

export default TeachingCallStatusCtrl;
