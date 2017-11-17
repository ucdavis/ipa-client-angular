/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */

summaryApp.controller('SummaryCtrl', ['$scope', '$routeParams', '$rootScope', '$location', 'authService', 'summaryActionCreators',
		this.SummaryCtrl = function ($scope, $routeParams, $rootScope, $location, authService, summaryActionCreators) {
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
			var isInstructionalSupport = currentUser.hasRoles(['studentMasters', 'studentPhd', 'instructionalSupport'], $scope.workgroupId);

			if (isAcademicPlanner || isReviewer || isAdmin) {
				$scope.setActiveMode("workgroup");
			}
			else if (isInstructor) {
				$scope.setActiveMode("instructor");
			}
			else if (isInstructionalSupport) {
				$scope.setActiveMode("instructionalSupport");
			} else {
				$scope.setActiveMode("unknown");
			}
		}

		$scope.getTermDisplayName = function (term) {
			return term.getTermDisplayName(term);
		};

		$scope.selectTab = function(tab) {
			$scope.view.state.ui.allTerms.forEach(function(term) {
				if (term.getTermDisplayName() == tab) {
					$scope.selectTerm(term);
				}
			});
		};

		$scope.selectTerm = function (term) {
			summaryActionCreators.selectTerm(term);
		};

		$rootScope.$on('summaryStateChanged', function (event, data) {
			$scope.view.state = data;
		});

		$rootScope.$on('sharedStateSet', function (event, data) {
			$scope.sharedState = data;
		});
	}]);

SummaryCtrl.authenticate = function (authService, $route, $window, $location, summaryActionCreators) {
	return authService.validate(localStorage.getItem('JWT'), $route.current.params.workgroupId, $route.current.params.year).then(function () {
		return summaryActionCreators.getInitialState($route.current.params.workgroupId, $route.current.params.year);
	});
};
