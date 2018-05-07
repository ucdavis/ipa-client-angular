class TeachingCallResponseReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, teachingCallResponseReportActionCreators, AuthService, TeachingCallResponseReportService, TermService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$route = $route;
		this.$routeParams = $routeParams;
		this.teachingCallResponseReportActionCreators = teachingCallResponseReportActionCreators;
		this.authService = AuthService;
		this.teachingCallResponseReportService = TeachingCallResponseReportService;
		this.thermService = TermService;


		this.getPayload().then( function(results) {
			self.initialize();
		});
	}

	initialize () {
		var self = this;
		this.$scope.workgroupId = this.$routeParams.workgroupId;
		this.$scope.year = this.$routeParams.year;

		this.$scope.view = {};

		this.$rootScope.$on('reportStateChanged', function (event, data) {
			self.$scope.view.state = data.state;

			self.$scope.view.hasAccess = self.$scope.sharedState.currentUser.isAdmin() ||
				self.$scope.sharedState.currentUser.hasRole('academicPlanner', self.$scope.sharedState.workgroup.id);
		});
	}

	getTermName (term) {
		return this.termService.getTermName(term);
	}

	download () {
		this.teachingCallResponseReportService.download($scope.workgroupId, $scope.year);
	}

	getPayload () {
		var self = this;
		return self.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			return self.teachingCallResponseReportActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year);
		});
	}
}

TeachingCallResponseReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'TeachingCallResponseReportActionCreators', 'AuthService', 'TeachingCallResponseReportService', 'TermService'];

export default TeachingCallResponseReportCtrl;
