class ScheduleSummaryReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, Term, ScheduleSummaryReportActionCreators, AuthService, ScheduleSummaryReportService) {
		var _self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.$route = $route;
		this.Term = Term;
		this.ScheduleSummaryReportActionCreators = ScheduleSummaryReportActionCreators;
		this.AuthService = AuthService;
		this.ScheduleSummaryReportService = ScheduleSummaryReportService;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;

		if (!$scope.termShortCode) {
			var termStates = AuthService.getTermStates();
			$scope.termShortCode = _self.calculateCurrentTermShortCode(termStates);
		}

		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};

		// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
		if ($scope.termShortCode == null) {
			$rootScope.loadingView = false;
			$scope.view.state = {};
		}

		$scope.download = function () {
			ScheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, $scope.termShortCode);
		};

		// Identifying
		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;

			$scope.view.hasAccess = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
		});

		$scope.allTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
		$scope.fullTerms = [];

		index = $scope.allTerms.indexOf($scope.termShortCode) - 1;
		if (index < 0) {
			$scope.previousShortTermCode = null;
		} else {
			$scope.previousShortTermCode = $scope.allTerms[index];
		}

		var index = $scope.allTerms.indexOf($scope.termShortCode) + 1;
		if (index > 8) {
			$scope.nextShortTermCode = null;
		} else {
			$scope.nextShortTermCode = $scope.allTerms[index];
		}

		for (var i = 0; i < $scope.allTerms.length; i++) {
			let shortTermCode = $scope.allTerms[i];
			let slotYear = parseInt($scope.year) + 1;

			if (parseInt(shortTermCode) > 4) {
				slotYear = $scope.year;
			}

			let fullTerm = slotYear + shortTermCode;
			$scope.fullTerms.push(fullTerm);
		}
	}

	calculateCurrentTermShortCode (termStates) {
		var earliestTermCode = null;
	
		termStates.forEach(function(termState) {
	
			if (termState.state == "ANNUAL_DRAFT") {
	
				if ((earliestTermCode == null) || earliestTermCode > termState.termCode) {
					earliestTermCode = termState.termCode;
				}
			}
		});
	
		// Default to fall quarter if current term cannot be deduced from termStates
		if (earliestTermCode == null) {
			return "10";
		}
	
		return earliestTermCode.slice(-2);
	}
}

ScheduleSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'Term', 'ScheduleSummaryReportActionCreators', 'AuthService', 'ScheduleSummaryReportService'];

export default ScheduleSummaryReportCtrl;
