/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
teachingCallResponseReportApp.controller('TeachingCallResponseReportCtrl',
	['$scope', '$rootScope', '$routeParams', 'teachingCallResponseReportActionCreators', 'authService', 'teachingCallResponseReportService', 'termService',
	this.TeachingCallResponseReportCtrl = function ($scope, $rootScope, $routeParams, scheduleSummaryReportActionCreators, authService, teachingCallResponseReportService, termService) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;

			$scope.view.hasAccess = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
		});

		$scope.getTermName = function(term) {
			return termService.getTermName(term);
		};

		$scope.download = function () {
			teachingCallResponseReportService.download($scope.workgroupId, $scope.year);
		};
	}
]);

TeachingCallResponseReportCtrl.getPayload = function (authService, $route, Term, teachingCallResponseReportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return teachingCallResponseReportActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};