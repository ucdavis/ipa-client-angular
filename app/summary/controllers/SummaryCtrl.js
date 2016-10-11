/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */

summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$rootScope', '$location', 'authService',
		this.SummaryCtrl = function ($scope, $routeParams, $rootScope, $location, authService) {
		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;
		$scope.view = {};

		// Update the view mode when the url param changes
		$scope.$on('$routeUpdate', function () {
			$scope.view.mode = $location.search().mode;
		});

		$scope.setActiveMode = function (mode) {
			$scope.view.mode = mode;
			$location.search({ mode: mode });
		};

		if ($routeParams.mode) {
			// Set the active tab according to the URL
			$scope.view.mode = $routeParams.mode;
		} else {
			// Otherwise redirect to the default view
			var isAdmin = authService.isAdmin();
			var isAcademicPlanner = authService.isAcademicPlanner();
			var isInstructor = authService.isInstructor();
			if (isAcademicPlanner || isAdmin) {
				$scope.setActiveMode("workgroup");
			}
			else if (isInstructor) {
				$scope.setActiveMode("instructor");
			}
		}

		$rootScope.$on('summaryStateChanged', function (event, data) {
			$scope.view.state = data;
			setUserTeachingCalls();
		});

		$rootScope.$on('sharedStateSet', function (event, data) {
			$scope.sharedState = data;
		});

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

SummaryCtrl.authenticate = function (authService, $route, $window, $location, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
