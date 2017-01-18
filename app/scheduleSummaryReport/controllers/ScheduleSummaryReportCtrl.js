/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
scheduleSummaryReportApp.controller('ScheduleSummaryReportCtrl', ['$scope', '$rootScope', '$routeParams', 'Term', 'scheduleSummaryReportActionCreators', 'authService', 'scheduleSummaryReportService',
	this.ScheduleSummaryReportCtrl = function ($scope, $rootScope, $routeParams, Term, scheduleSummaryReportActionCreators, authService, scheduleSummaryReportService) {

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;

		if (!$scope.termShortCode) {
			var termStates = authService.getTermStates();
			$scope.termShortCode = calculateCurrentTermShortCode(termStates);
		}

		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};

		// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
		if ($scope.termShortCode == null) {
			$rootScope.loadingView = false;
			$scope.view.state = {};
		}

		$scope.download = function () {
			scheduleSummaryReportService.downloadSchedule($scope.workgroupId, $scope.year, $scope.termShortCode);
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
			shortTermCode = $scope.allTerms[i];

			if (parseInt(shortTermCode) > 4) {
				slotYear = $scope.year;
			} else {
				slotYear = parseInt($scope.year) + 1;
			}
			fullTerm = slotYear + shortTermCode;
			$scope.fullTerms.push(fullTerm);
		}

		$scope.getTermName = function(term) {
			var endingYear = "";
			if (term && term.length == 6) {
				endingYear = term.substring(0,4);
				term = term.slice(-2);
			}

			termNames = {
				'05': 'Summer Session 1',
				'06': 'Summer Special Session',
				'07': 'Summer Session 2',
				'08': 'Summer Quarter',
				'09': 'Fall Semester',
				'10': 'Fall Quarter',
				'01': 'Winter Quarter',
				'02': 'Spring Semester',
				'03': 'Spring Quarter'
			};

			return termNames[term] + " " + endingYear;
		};

	}
]);

ScheduleSummaryReportCtrl.getPayload = function (authService, $route, Term, scheduleSummaryReportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {

		var termShortCode = $route.current.params.termShortCode;

		if (!termShortCode) {
			var termStates = authService.getTermStates();
			var termShortCode = calculateCurrentTermShortCode(termStates);
		}

		var term = Term.prototype.getTermByTermShortCodeAndYear(termShortCode, $route.current.params.year);
		return scheduleSummaryReportActionCreators.getInitialState(
			$route.current.params.workgroupId,
			$route.current.params.year,
			term.code
		);
	});
};

calculateCurrentTermShortCode = function(termStates) {
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
};