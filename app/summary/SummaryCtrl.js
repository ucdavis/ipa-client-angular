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
		this.authService = AuthService;
		this.summaryActionCreators = SummaryActionCreators;

		this.$scope.workgroupId = this.$routeParams.workgroupId;
		this.$scope.year = this.$routeParams.year;
		this.$scope.view = {};

		this.getPayload().then( function() {
			self.initialize();
		});
	}

	initialize () {
		var self = this;
		// Update the view mode when the url param changes
		this.$scope.$on('$routeUpdate', function () {
			self.$scope.view.mode = self.$location.search().mode;
		});

		this.$scope.setActiveMode = function (mode) {
			self.$scope.view.mode = mode;
			self.$location.search({ mode: mode });
		};

		if (this.$routeParams.mode) {
			// Set the active tab according to the URL
			this.$scope.view.mode = this.$routeParams.mode;
		} else {
			// Otherwise redirect to the default view
			var currentUser = this.authService.getCurrentUser();
			var isAdmin = currentUser.isAdmin();
			var isAcademicPlanner = currentUser.hasRole('academicPlanner', this.$scope.workgroupId);
			var isReviewer = currentUser.hasRole('reviewer', this.$scope.workgroupId);
			var isInstructor = currentUser.hasRoles(['senateInstructor', 'federationInstructor'], this.$scope.workgroupId);
			var isInstructionalSupport = currentUser.hasRoles(['studentMasters', 'studentPhd', 'instructionalSupport'], this.$scope.workgroupId);

			if (isAcademicPlanner || isReviewer || isAdmin) {
				this.$scope.setActiveMode("workgroup");
			}
			else if (isInstructor) {
				this.$scope.setActiveMode("instructor");
			}
			else if (isInstructionalSupport) {
				this.$scope.setActiveMode("instructionalSupport");
			} else {
				this.$scope.setActiveMode("unknown");
			}
		}

		this.$scope.getTermDisplayName = function (term) {
			return term.getTermDisplayName(term);
		};

		this.$scope.selectTab = function(tab) {
			self.$scope.view.state.ui.allTerms.forEach(function(term) {
				if (term.getTermDisplayName() == tab) {
					self.$scope.selectTerm(term);
				}
			});
		};

		this.$scope.selectTerm = function (term) {
			self.summaryActionCreators.selectTerm(term);
		};

		this.$rootScope.$on('summaryStateChanged', function (event, data) {
			self.$scope.view.state = data;
		});

		this.$rootScope.$on('sharedStateSet', function (event, data) {
			self.$scope.sharedState = data;
		});
	}

	getPayload () {
		var self = this;
		return this.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			return self.summaryActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year);
		});
	
	}
}

 SummaryCtrl.$inject = ['$scope', '$route', '$routeParams', '$rootScope', '$location', 'AuthService', 'SummaryActionCreators'];

 export default SummaryCtrl;
