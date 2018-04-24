class TeachingCallResponseReportCtrl {
	constructor ($scope, $rootScope, $routeParams, teachingCallResponseReportActionCreators, AuthService, TeachingCallResponseReportService, TermService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.teachingCallResponseReportActionCreators = teachingCallResponseReportActionCreators;
		this.authService = AuthService;
		this.teachingCallResponseReportService = TeachingCallResponseReportService;
		this.thermService = TermService;



		$scope.workgroupId = $routeParams.workgroupId;
		$scope.year = $routeParams.year;

		$scope.view = {};

		$rootScope.$on('reportStateChanged', function (event, data) {
			$scope.view.state = data.state;

			$scope.view.hasAccess = $scope.sharedState.currentUser.isAdmin() ||
				$scope.sharedState.currentUser.hasRole('academicPlanner', $scope.sharedState.workgroup.id);
		});
	}

	getTermName (term) {
		return this.termService.getTermName(term);
	};

	download () {
		this.teachingCallResponseReportService.download($scope.workgroupId, $scope.year);
	};

	getPayload () {
		var self = this;
		return self.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {
			return self.teachingCallResponseReportActionCreators.getInitialState(self.$route.current.params.workgroupId, self.$route.current.params.year);
		});
	};
};


TeachingCallResponseReportCtrl.$inject = ['$scope', '$rootScope', '$routeParams', 'teachingCallResponseReportActionCreators', 'AuthService', 'TeachingCallResponseReportService', 'TermService'];

export default ScheduleSummaryReportCtrl;
