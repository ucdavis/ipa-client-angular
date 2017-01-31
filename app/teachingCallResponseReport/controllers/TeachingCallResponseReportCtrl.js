/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the ipaClientAngularApp
 */
teachingCallResponseReportApp.controller('TeachingCallResponseReportCtrl', ['$scope', '$rootScope', '$routeParams', 'Term', 'teachingCallResponseReportActionCreators', 'authService',
	this.TeachingCallResponseReportCtrl = function ($scope, $rootScope, $routeParams, Term, scheduleSummaryReportActionCreators, authService) {

		$scope.blob = "0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0";
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

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

TeachingCallResponseReportCtrl.getPayload = function (authService, $route, Term, teachingCallResponseReportActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return teachingCallResponseReportActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};