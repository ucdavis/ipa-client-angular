class TeachingCallResponseReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, TeachingCallResponseReportActionCreators, AuthService, TeachingCallResponseReportService, TermService, validate) {
		var _self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.TeachingCallResponseReportActionCreators = TeachingCallResponseReportActionCreators;
		this.authService = AuthService;
		this.TeachingCallResponseReportService = TeachingCallResponseReportService;
		this.TermService = TermService;

		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.workgroupId = this.$routeParams.workgroupId;
		$scope.year = this.$routeParams.year;

		$scope.view = {};

		$rootScope.$on('reportStateChanged', function (event, data) {
			_self.$scope.view.state = data.state;

			_self.$scope.view.hasAccess = _self.$scope.sharedState.currentUser.isAdmin() ||
			_self.$scope.sharedState.currentUser.hasRole('academicPlanner', _self.$scope.sharedState.workgroup.id);
		});

		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$scope.getTermName = function(term) {
			return TermService.getTermName(term);
		};

		$scope.download = function () {
			TeachingCallResponseReportService.download($scope.workgroupId, $scope.year);
		};
	}
}

TeachingCallResponseReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'TeachingCallResponseReportActionCreators', 'AuthService', 'TeachingCallResponseReportService', 'TermService', 'validate'];

export default TeachingCallResponseReportCtrl;
