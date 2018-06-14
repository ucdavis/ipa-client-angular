class DeansOfficeReportCtrl {
	constructor ($scope, $rootScope, $routeParams, DeansOfficeReportActions, AuthService) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.WorkloadSummaryActions = WorkloadSummaryActions;
		this.AuthService = AuthService;
		var _self = this;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('workloadSummaryStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});
	}
}

DeansOfficeReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'DeansOfficeReportActions', 'AuthService'];

export default DeansOfficeReportCtrl;
