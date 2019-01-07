class WorkloadSummaryReportCtrl {
	constructor ($scope, $rootScope, $routeParams, WorkloadSummaryActions, AuthService, validate) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.WorkloadSummaryActions = WorkloadSummaryActions;
		this.AuthService = AuthService;

		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('workloadSummaryStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});

		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$rootScope.$on('sharedStateSet', function (event, data) {
			$scope.sharedState = data;
		});
	}
}

WorkloadSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'WorkloadSummaryActions', 'AuthService', 'validate'];

export default WorkloadSummaryReportCtrl;
