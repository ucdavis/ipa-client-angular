/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
reportApp.controller('ReportCtrl', ['$scope', '$rootScope', '$routeParams', 'reportActionCreators',
	this.ReportCtrl = function ($scope, $rootScope, $routeParams, reportActionCreators) {

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = {
			selectedTermCode: null
		};

		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});

		$scope.startComparison = function () {
			reportActionCreators.beginComparison();
			reportActionCreators.getTermComparisonReport(
				$scope.workgroupId,
				$scope.year,
				$scope.view.selectedTermCode
			);
		};
	}
]);

ReportCtrl.getPayload = function (authService, $route, reportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return reportActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
