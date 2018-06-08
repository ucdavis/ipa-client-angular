/**
 * @ngdoc function
 * @name summaryApp.controller:SummaryCtrl
 * @description
 * # SummaryCtrl
 * Controller of the summaryApp
 */

 class SummaryCtrl {
		constructor ($scope, $route, $routeParams, $rootScope, $location, AuthService, SummaryActionCreators) {
		var self = this;
		this.$scope = $scope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.$rootScope = $rootScope;
		this.$location = $location;
		this.AuthService = AuthService;
		this.SummaryActionCreators = SummaryActionCreators;

		$scope.workgroupId = this.$routeParams.workgroupId;
		$scope.year = this.$routeParams.year;
		$scope.view = {};

		var self = this;
		// Update the view mode when the url param changes
		$scope.$on('$routeUpdate', function () {
			self.$scope.view.mode = self.$location.search().mode;
		});

		$scope.setActiveMode = function (mode) {
			self.$location.search({ mode: mode });
		};

		$scope.getTermDisplayName = function (term) {
			return term.getTermDisplayName(term);
		};

		$scope.selectTab = function(tab) {
			self.$scope.view.state.ui.allTerms.forEach(function(term) {
				if (term.getTermDisplayName() == tab) {
					self.$scope.selectTerm(term);
				}
			});
		};

		$scope.selectTerm = function (term) {
			self.SummaryActionCreators.selectTerm(term);
		};

		$rootScope.$on('summaryStateChanged', function (event, data) {
			self.$scope.view.state = data;
			self.setMode($scope, $routeParams, AuthService);
		});

		$rootScope.$on('sharedStateSet', function (event, data) {
			self.$scope.sharedState = data;
		});
	}

	setMode ($scope, $routeParams, AuthService) {
		if ($routeParams.mode && $routeParams.mode != "unknown") {
			// Set the active tab according to the URL
			$scope.view.mode = $routeParams.mode;
		} else {
			// Otherwise redirect to the default view
			var currentUser = AuthService.getCurrentUser();
			var isAdmin = currentUser.isAdmin();
			var isAcademicPlanner = currentUser.hasRole('academicPlanner', $scope.workgroupId);
			var isReviewer = currentUser.hasRole('reviewer', $scope.workgroupId);
			var isInstructor = currentUser.isInstructor($scope.workgroupId);
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
	}
}

SummaryCtrl.$inject = ['$scope', '$route', '$routeParams', '$rootScope', '$location', 'AuthService', 'SummaryActionCreators'];

export default SummaryCtrl;
