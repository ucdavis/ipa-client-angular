class ScheduleSummaryReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, Term, ScheduleSummaryReportActionCreators, AuthService, ScheduleSummaryReportService, TermService, validate) {
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
		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		if (!$scope.termShortCode) {
			var termStates = AuthService.getTermStates();
			$scope.termShortCode = _self.calculateCurrentTermShortCode(termStates);
		}

		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};
		$scope.view.ui = {
			filterOptions: [{ description: 'Hide Instructor Types', selected: false }],
			hideInstructorTypes: false
		};

		$scope.toggleFilter = function (filter) {
			filter.selected = !filter.selected;

			$scope.view.ui.hideInstructorTypes = $scope.view.ui.filterOptions.find((option) => option.description = 'Hide Instructor Types').selected;
		};

		// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
		if ($scope.termShortCode == null) {
			$rootScope.loadingView = false;
			$scope.view.state = {};
		}

		$scope.download = function (filterByTerm) {
			if (filterByTerm){
				ScheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, $scope.termShortCode);
			} else {
				ScheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, null);
			}
		};

		$scope.downloadSimpleView = function () {
			ScheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, null, true);
		};

		$scope.downloadCourseListings = function () {
			ScheduleSummaryReportService.downloadCourseListings($scope.workgroupId, $scope.year, null);
		};

		$scope.getTermName = function(termCode) {
			return TermService.getShortTermName(termCode);
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

ScheduleSummaryReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'Term', 'ScheduleSummaryReportActionCreators', 'AuthService', 'ScheduleSummaryReportService', 'TermService', 'validate'];

export default ScheduleSummaryReportCtrl;
