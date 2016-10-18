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
			var currentUser = authService.getCurrentUser();
			var isAdmin = currentUser.isAdmin();
			var isAcademicPlanner = currentUser.hasRole('academicPlanner', $scope.workgroupId);
			var isReviewer = currentUser.hasRole('reviewer', $scope.workgroupId);
			var isInstructor = currentUser.hasRoles(['senateInstructor', 'federationInstructor'], $scope.workgroupId);
			if (isAcademicPlanner || isReviewer || isAdmin) {
				$scope.setActiveMode("workgroup");
			}
			else if (isInstructor) {
				$scope.setActiveMode("instructor");
			} else {
				$scope.setActiveMode("unknown");
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
			var isFederationInstructor = $scope.sharedState.currentUser.hasRole('federationInstructor', $scope.workgroupId);
			var isSenateInstructor = $scope.sharedState.currentUser.hasRole('senateInstructor', $scope.workgroupId);
			$scope.view.userTeachingCalls = $scope.view.state.teachingCalls.ids.map(function (teachingCallId) {
				return $scope.view.state.teachingCalls.list[teachingCallId];
			}).filter(function (teachingCall) {
				return (teachingCall.sentToFederation && isFederationInstructor) ||
					(teachingCall.sentToSenate && isSenateInstructor);
			});

			$scope.view.userTeachingCalls.forEach(function (userTeachingCall) {
				$scope.view.state.teachingCallReceipts.ids.forEach(function (teachingCallReceiptId) {
					var teachingCallReceipt = $scope.view.state.teachingCallReceipts.list[teachingCallReceiptId];
					if (teachingCallReceipt.teachingCallId === userTeachingCall.id) {
						userTeachingCall.preferencesSubmitted = true;
					}
				});
			});
		};
	}]);

SummaryCtrl.authenticate = function (authService, $route, $window, $location, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
