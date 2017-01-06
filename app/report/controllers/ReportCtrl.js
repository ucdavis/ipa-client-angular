/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
reportApp.controller('ReportCtrl', ['$scope', '$rootScope', '$routeParams', 'Term', 'reportActionCreators',
	this.ReportCtrl = function ($scope, $rootScope, $routeParams, Term, reportActionCreators) {

		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.termShortCode = $routeParams.termShortCode;
		$scope.term = Term.prototype.getTermByTermShortCodeAndYear($scope.termShortCode, $scope.year);
		$scope.view = {};

		// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
		if ($scope.termShortCode == null) {
			$rootScope.loadingView = false;
			$scope.view.state = {};
		}

		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;

			$scope.view.hasAccess = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
		});

		$scope.allTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
		$scope.fullTerms = [];

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

ReportCtrl.getPayload = function (authService, $route, Term, reportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {

		// Don't attempt to get payload if page is reached via global nav link
		if ($route.current.params.termShortCode) {
			var term = Term.prototype.getTermByTermShortCodeAndYear($route.current.params.termShortCode, $route.current.params.year);
			return reportActionCreators.getInitialState(
				$route.current.params.workgroupId,
				$route.current.params.year,
				term.code
			);
		} else {
			return {};
		}
	});
};
