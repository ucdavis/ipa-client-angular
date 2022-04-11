class WorkloadSummaryReportCtrl {
	constructor($scope, $rootScope, $routeParams, $anchorScroll, WorkloadSummaryActions, AuthService, validate) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.WorkloadSummaryActions = WorkloadSummaryActions;
		this.AuthService = AuthService;
		$anchorScroll.yOffset = 90;

		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.departmentName = JSON.parse(localStorage.getItem("workgroup")).name;

		$scope.view = {};

		$rootScope.$on('workloadSummaryStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});

		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		$rootScope.$on('sharedStateSet', function (event, data) {
			$scope.sharedState = data;
		});

		$scope.download = function () {
			WorkloadSummaryActions.download();
		};
		$scope.downloadAll = function () {
			WorkloadSummaryActions.downloadAll().then(
				response => {
					debugger;
					var url = window.URL.createObjectURL(
						new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
					);
					var a = window.document.createElement('a'); // eslint-disable-line
					a.href = url;
					var year = JSON.parse(localStorage.getItem('year'));
					a.download = `Workload Report ${year}.xlsx`;
					window.document.body.appendChild(a); // eslint-disable-line
					a.click();
					a.remove();  //afterwards we remove the element again

				})
				;
		};

		$scope.export = function () {
			WorkloadSummaryActions.export();
		};

		$scope.exportAll = function () {
			WorkloadSummaryActions.exportAll();
		};

		$scope.goToSection = function (id) {
			var tableSection = $scope.view.state.instructorTypes.list[id].description;
			$anchorScroll(tableSection);
		};
	}
}

WorkloadSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$anchorScroll', 'WorkloadSummaryActions', 'AuthService', 'validate'];

export default WorkloadSummaryReportCtrl;
