/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('InstructionalSupportAssignmentCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportAssignmentActionCreators',
		this.InstructionalSupportAssignmentCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportAssignmentActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('assignmentStateChanged', function (event, data) {
				$scope.view.state = data;
			});

			$scope.setActiveTab = function (tabName) {
				$location.search({ tab: tabName });
				switch (tabName) {
					case "instructionalSupportStaff":
						//$scope.showInstructors();
						break;
					default:
						//$scope.showCourses();
						break;
				}
			};

			// Set the active tab according to the URL
			// Otherwise redirect to the default view
			$scope.setActiveTab($routeParams.tab || "courses");

	}]);

InstructionalSupportAssignmentCtrl.getPayload = function (authService, instructionalSupportAssignmentActionCreators, $route) {
	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		instructionalSupportAssignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.tab);
	});
};