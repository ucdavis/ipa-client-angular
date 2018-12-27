class WorkloadSummaryReportCtrl {
	constructor ($scope, $rootScope, $routeParams, WorkloadSummaryActions, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.WorkloadSummaryActions = WorkloadSummaryActions;
		this.AuthService = AuthService;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('workloadSummaryStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});
	}
}

WorkloadSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'WorkloadSummaryActions', 'AuthService'];

export default WorkloadSummaryReportCtrl;
