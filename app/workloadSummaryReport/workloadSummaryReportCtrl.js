class WorkloadSummaryReportCtrl {
	constructor ($scope, $rootScope, $routeParams, $anchorScroll, WorkloadSummaryActions, AuthService, validate) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.WorkloadSummaryActions = WorkloadSummaryActions;
		this.AuthService = AuthService;
		$anchorScroll.yOffset = 90;

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

		$scope.download = function() {
			WorkloadSummaryActions.download();
		};

		$scope.goToSection = function(id) {
			var tableSection = $scope.view.state.instructorTypes.list[id].description;
			$anchorScroll(tableSection);
		};
	}
}

WorkloadSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$anchorScroll', 'WorkloadSummaryActions', 'AuthService', 'validate'];

export default WorkloadSummaryReportCtrl;
