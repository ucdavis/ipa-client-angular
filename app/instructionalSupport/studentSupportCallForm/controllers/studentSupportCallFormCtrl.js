/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:AssignmentCtrl
 * @description
 * # AssignmentCtrl
 * Controller of the ipaClientAngularApp
 */
instructionalSupportApp.controller('StudentSupportCallFormCtrl', ['$scope', '$rootScope', '$window', '$location', '$routeParams', '$uibModal', 'instructionalSupportAssignmentActionCreators',
		this.StudentSupportCallFormCtrl = function ($scope, $rootScope, $window, $location, $routeParams, $uibModal, instructionalSupportAssignmentActionCreators) {
			$window.document.title = "Instructional Support";
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.nextYear = (parseInt($scope.year) + 1).toString().slice(-2);
			$scope.view = {};

			$rootScope.$on('instructionalSupportAssignmentStateChanged', function (event, data) {
				$scope.view.state = data.state;
			});

			$( "#sortable" ).sortable({
				placeholder: "sortable-student-preference-placeholder",
				axis: "y"
			});
	}]);

StudentSupportCallFormCtrl.getPayload = function (authService, instructionalSupportAssignmentActionCreators, $route) {
//	authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
//		instructionalSupportAssignmentActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year, $route.current.params.termShortCode, $route.current.params.tab);
//	});
};