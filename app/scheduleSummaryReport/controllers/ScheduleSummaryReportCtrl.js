class ScheduleSummaryReportCtrl {
	constructor($scope, $rootScope, $routeParams, $route, Term, scheduleSummaryReportActionCreators, AuthService, scheduleSummaryReportService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.$route = $route;
		this.Term = Term;
		this.scheduleSummaryReportActionCreators = scheduleSummaryReportActionCreators;
		this.authService = AuthService;
		this.scheduleSummaryReportService = scheduleSummaryReportService;

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;

		if (!$scope.termShortCode) {
			var termStates = authService.getTermStates();
			$scope.termShortCode = calculateCurrentTermShortCode(termStates);
		}

		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};

		this.getPayload().then( function(results) {
			// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
			if ($scope.termShortCode == null) {
				$rootScope.loadingView = false;
				$scope.view.state = {};
			}

			$rootScope.$on('sharedStateSet', function (event, data) {
				$scope.sharedState = data;
				debugger;

				$scope.view.hasAccess = $scope.sharedState ? ($scope.sharedState.currentUser.isAdmin() || $scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id)) : false;
			});

			// Identifying
			$rootScope.$on('reportStateChanged', function (event, data) {
				$scope.view.state = data.state;
				console.log($scope.view.state);

				$scope.view.hasAccess = $scope.sharedState ? ($scope.sharedState.currentUser.isAdmin() || $scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id)) : false;
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

				$scope.fullTerms.push(slotYear + shortTermCode);
			}
		});
	}

	download () {
		scheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, $scope.termShortCode);
	}

	calculateCurrentTermShortCode(termStates) {
		var earliestTermCode = null;

		termStates.forEach( function(termState) {

			if (termState.state == "ANNUAL_DRAFT") {

				if ( (earliestTermCode == null) || earliestTermCode > termState.termCode) {
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

	getPayload() {
		var self = this;
		return self.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			var termShortCode = self.$route.current.params.termShortCode;

			if (!termShortCode) {
				var termStates = authService.getTermStates();
				var termShortCode = self.calculateCurrentTermShortCode(termStates);
			}

			var term = self.Term.prototype.getTermByTermShortCodeAndYear(termShortCode, self.$route.current.params.year);
			return self.scheduleSummaryReportActionCreators.getInitialState(
				self.$route.current.params.workgroupId,
				self.$route.current.params.year,
				term.code
			);
		});
	}
};

ScheduleSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$route', 'Term', 'ScheduleSummaryReportActionCreators', 'AuthService', 'ScheduleSummaryReportService'];

export default ScheduleSummaryReportCtrl;
