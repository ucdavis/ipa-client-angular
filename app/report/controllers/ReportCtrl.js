/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
reportApp.controller('ReportCtrl', ['$scope', '$rootScope', '$routeParams', 'Term', 'reportActionCreators',
	this.ReportCtrl = function ($scope, $rootScope, $routeParams, Term, reportActionCreators) {

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;
		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};

		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});

	}
]);

ReportCtrl.getPayload = function (authService, $route, Term, reportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		var term = Term.prototype.getTermByTermShortCodeAndYear($route.current.params.termShortCode, $route.current.params.year);
		return reportActionCreators.getInitialState(
			$route.current.params.workgroupId,
			$route.current.params.year,
			term.code
		);
	});
};
