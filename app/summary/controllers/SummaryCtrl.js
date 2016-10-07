/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */

summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$rootScope',
		this.SummaryCtrl = function ($scope, $routeParams, $rootScope) {
			$scope.workgroupId = $routeParams.workgroupId;
			$scope.year = $routeParams.year;
			$scope.view = {};

			$rootScope.$on('summaryStateChanged', function (event, data) {
				$scope.view.state = data;
				setUserTeachingCalls();
			});

			$rootScope.$on('sharedStateSet', function (event, data) {
				$scope.sharedState = data;
			});

			$scope.getTermName = function(term) {
				var endingYear = "";
				if (term.length == 6) {
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

			// Will translate a dayIndicator like '0010100' into 'TR'
			$scope.dayIndicatorToDayCodes = function (dayIndicator) {
				dayCodes = "";
				// Handle incorrect data
				if (dayIndicator.length === 0) {
					return dayCodes;
				}
				dayStrings = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
				for (var i = 0; i < dayIndicator.length; i++) {
					char = dayIndicator.charAt(i);
					if (Number(char) == 1) {
						dayCodes += dayStrings[i];
					}
				}

				return dayCodes;
			};

			$scope.isInstructor = function () {
				if ($scope.userHasRolesForWorkgroup(['senateInstructor'], $scope.sharedState.workgroup) || $scope.userHasRolesForWorkgroup(['federationInstructor'], $scope.sharedState.workgroup)) {
					return true;
				}

				return false;
			};

			$scope.isAcademicPlanner = function () {
				if ($scope.userHasRolesForWorkgroup(['academicPlanner'], $scope.sharedState.workgroup)) {
					return true;
				}

				return false;
			};

			var setUserTeachingCalls = function () {
				var userRoles = $scope.sharedState.currentUserRoles;
				$scope.view.userTeachingCalls = $scope.view.state.teachingCalls.ids.map(function (teachingCallId) {
					return $scope.view.state.teachingCalls.list[teachingCallId];
				}).filter(function (teachingCall) {
					return (teachingCall.sentToFederation && userRoles.indexOf('federationInstructor') >= 0) ||
						(teachingCall.sentToSenate && userRoles.indexOf('senateInstructor') >= 0);
				});
			};
}]);

SummaryCtrl.authenticate = function (authService, $route, $window, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {

		var path = $window.location.pathname.split('/');
		var lastPathString = path[path.length - 1];

		// Ensure user is not at a generic '/summary/20/2016' route, and should have access to this summary page
		if ((lastPathString == "instructor" && authService.isInstructor()) || (lastPathString == "workgroup" && authService.isAcademicPlanner())) {
			return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
		}

		// Otherwise redirect to an appropriate default Summary screen (ex: '/summary/20/2016/instructor')
		var userRoles = authService.getUserRoles();
		var isAcademicPlanner = authService.isAcademicPlanner();
		var isInstructor = authService.isInstructor();

		if (isAcademicPlanner) {
			location.href = location.href + "/workgroup";
		}
		else if (isInstructor) {
			location.href = location.href + "/instructor";
		}

	});
};
