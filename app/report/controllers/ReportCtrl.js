/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
reportApp.controller('ReportCtrl', ['$scope', '$rootScope', '$routeParams', 'reportActionCreators', 'reportService', 'Term',
		this.ReportCtrl = function ($scope, $rootScope, $routeParams, reportActionCreators, reportService, Term) {

		}
]);

ReportCtrl.getPayload = function (authService, $route, reportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return reportActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
