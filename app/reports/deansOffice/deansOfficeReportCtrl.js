class DeansOfficeReportCtrl {
	constructor ($scope, $rootScope, $routeParams) {
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		var _self = this;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		// $rootScope.$on('workloadSummaryStateChanged', function (event, data) {
		// 	$scope.view.state = data.state;
		// });
	}
}

DeansOfficeReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams'];

export default DeansOfficeReportCtrl;
