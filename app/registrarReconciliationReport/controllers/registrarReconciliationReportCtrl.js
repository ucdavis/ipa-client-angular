/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:RegistrarReconciliationReportCtrl
 * @description
 * # RegistrarReconciliationReportCtrl
 * Controller of the ipaClientAngularApp
 */
class registrarReconciliationReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, Term, registrarReconciliationReportActionCreators, AuthService) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.$route = $route;
		this.Term = Term;
		this.registrarReconciliationReportActionCreators = registrarReconciliationReportActionCreators;
		this.authService = AuthService;

		this.getPayload().then( function() {
			self.initialize();
		});
	}

	getPayload () {
		var self = this;

		return this.authService.validate(localStorage.getItem('JWT'), self.$route.current.params.workgroupId, self.$route.current.params.year).then(function () {

			var termShortCode = self.$route.current.params.termShortCode;
	
			if (!termShortCode) {
				var termStates = authService.getTermStates();
				var termShortCode = calculateCurrentTermShortCode(termStates);
			}
	
			var term = self.Term.prototype.getTermByTermShortCodeAndYear(termShortCode, self.$route.current.params.year);
			return self.registrarReconciliationReportActionCreators.getInitialState(
				self.$route.current.params.workgroupId,
				self.$route.current.params.year,
				term.code
			);
		});	
	}

	initialize () {
		var self = this;
		this.$scope.workgroupId = this.$routeParams.workgroupId;
		this.$scope.year = this.$routeParams.year;
		this.$scope.termShortCode = this.$routeParams.termShortCode;

		if (!this.$scope.termShortCode) {
			var termStates = authService.getTermStates();
			this.$scope.termShortCode = calculateCurrentTermShortCode(termStates);
		}

		this.$scope.term = this.Term.prototype.getTermByTermShortCodeAndYear(this.$scope.termShortCode, this.$scope.year);
		this.$scope.view = {};

		// Remove cloak if the url is incomplete, no payload or state calculations are necessary.
		if (this.$scope.termShortCode == null) {
			this.$rootScope.loadingView = false;
			this.$scope.view.state = {};
		}

		this.$rootScope.$on('reportStateChanged', function (event, data) {
			self.$scope.view.state = data.state;

			self.$scope.view.hasAccess = self.$scope.sharedState.currentUser.isAdmin() ||
			self.$scope.sharedState.currentUser.hasRole('academicPlanner', self.$scope.sharedState.workgroup.id);
		});

		this.$scope.allTerms = ['05', '06', '07', '08', '09', '10', '01', '02', '03'];
		this.$scope.fullTerms = [];

		let index = this.$scope.allTerms.indexOf(this.$scope.termShortCode) - 1;

		if (index < 0) {
			index = 8;
		}

		this.$scope.previousShortTermCode = this.$scope.allTerms[index];

		index = this.$scope.allTerms.indexOf(this.$scope.termShortCode) + 1;
		if (index > 8) {
			index = 0;
		}

		this.$scope.nextShortTermCode = this.$scope.allTerms[index];

		for (var i = 0; i < this.$scope.allTerms.length; i++) {
			let shortTermCode = this.$scope.allTerms[i];
			let slotYear = parseInt(this.$scope.year) + 1;

			if (parseInt(shortTermCode) > 4) {
				slotYear = this.$scope.year;
			}

			let fullTerm = slotYear + shortTermCode;
			this.$scope.fullTerms.push(fullTerm);
		}
	}

	calculateCurrentTermShortCode (termStates) {
		var earliestTermCode = null;
	
		termStates.forEach( function(termState) {
	
			if (termState.state == "ANNUAL_DRAFT") {
	
				if ( (earliestTermCode == null) || earliestTermCode > termState.termCode) {
					earliestTermCode = termState.termCode;
				}
			}
		});
	
		// Default to fall quarter if current term cannot be deduced from termStates
		if (earliestTermCode == null) {
			return "10";
		}
	
		return earliestTermCode.slice(-2);
	}
}

registrarReconciliationReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'Term', 'RegistrarReconciliationReportActionCreators', 'AuthService'];

export default registrarReconciliationReportCtrl;
