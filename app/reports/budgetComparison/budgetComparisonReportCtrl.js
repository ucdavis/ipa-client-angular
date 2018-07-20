import './budgetComparisonReport.css';

class BudgetComparisonReportCtrl {
	constructor ($scope, $rootScope, $routeParams) {
    console.log("controller here!!!!!!!!!!!!!!");
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		var _self = this;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('budgetComparisonReportStateChanged', function (event, data) {
			$scope.view.state = data.state;
		});
	}
}

BudgetComparisonReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams'];

export default BudgetComparisonReportCtrl;
