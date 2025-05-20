/**
 * @ngdoc function
 * @name ipaClientAngularApp.controller:RegistrarReconciliationReportCtrl
 * @description
 * # RegistrarReconciliationReportCtrl
 * Controller of the ipaClientAngularApp
 */
class registrarReconciliationReportCtrl {
	constructor ($scope, $rootScope, $route, $routeParams, Term, RegistrarReconciliationReportActionCreators, AuthService, validate) {
		var self = this;
		this.$scope = $scope;
		this.$rootScope = $rootScope;
		this.$routeParams = $routeParams;
		this.$route = $route;
		this.Term = Term;
		this.registrarReconciliationReportActionCreators = RegistrarReconciliationReportActionCreators;
		this.authService = AuthService;
		$scope.noAccess = validate ? validate.noAccess : null;
		$scope.sharedState = $scope.sharedState || AuthService.getSharedState();

		self.initialize();
	}

	initialize () {
		var self = this;
		this.$scope.workgroupId = this.$routeParams.workgroupId;
		this.$scope.year = this.$routeParams.year;
		this.$scope.termShortCode = this.$routeParams.termShortCode;
		this.$scope.pendingUpdates = [];
		this.$scope.showUpdatesModal = false;
		this.$scope.showBulkUpdateButton = false;

		if (!this.$scope.termShortCode) {
			// LINTME
			var termStates = authService.getTermStates();// eslint-disable-line no-undef
			// LINTME
			this.$scope.termShortCode = calculateCurrentTermShortCode(termStates);// eslint-disable-line no-undef
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

			generateFilteredDisplay(data);

			self.$scope.showBulkUpdateButton = Object.values(self.$scope.view.state.sections.list).some(
				(section) => section.dwChanges || (section.id && (section.noLocal === false || section.noRemote === false))
			);

			self.$scope.view.hasAccess = self.$scope.sharedState.currentUser.isAdmin() ||
			self.$scope.sharedState.currentUser.hasRole(['academicPlanner', 'reviewer'], self.$scope.sharedState.workgroup.id);
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

		this.$scope.acceptBannerUpdates = function () {
			let updates = [];
			
			Object.values(this.view.state.sections.list)
				.filter((section) => section.dwHasChanges)
				.forEach((section) => {
					section.instructors.forEach((instructor) => {
						if (instructor.noRemote) {
							updates.push({
								section: section,
								property: 'unassign',
								instructor: instructor,
								uniqueKey: section.uniqueKey,
								isChecked: true,
							});
						}
						
						if (instructor.noLocal) {
							updates.push({
								section: section,
								property: 'assign',
								instructor: instructor,
								uniqueKey: section.uniqueKey,
								isChecked: true,
							});
						}
					});

					// activity changes
					section.activities.forEach((activity) => {
						if (activity.dwChanges) {
							Object.entries(activity.dwChanges).forEach(([property, { value }]) => {
								updates.push({
									section: section,
									activity: activity,
									property: property,
									value: value,
									uniqueKey: section.uniqueKey,
									isChecked: true,
								});
							});
						}
						});

					// property changes
					if (section.dwChanges) {
						Object.entries(section.dwChanges).forEach(([property, { value }]) => {
							updates.push({
								section: section,
								property: property,
								value: value,
								uniqueKey: section.uniqueKey,
								isChecked: true,
							});
						});
					}
				});

			self.$scope.pendingUpdates = updates;
			self.$scope.showUpdatesModal = true;
		};

		this.$scope.closeUpdatesModal = function () {
			self.$scope.pendingUpdates = [];
			self.$scope.showUpdatesModal = false;
		};

		this.$scope.applyUpdates = async function () {
			self.$scope.showUpdatesModal = false;

			const updateActions = {
				crn: (update) => self.registrarReconciliationReportActionCreators.updateSection({ id: update.section.id, crn: update.value }, 'crn', update.uniqueKey),
				seats: (update) => self.registrarReconciliationReportActionCreators.updateSection({ id: update.section.id, seats: update.value }, 'seats', update.uniqueKey),
				dayIndicator: (update) => self.registrarReconciliationReportActionCreators.updateActivity({ id: update.activity.id, typeCode: update.activity.typeCode, dayIndicator: update.value }, 'dayIndicator'),
				startTime: (update) => self.registrarReconciliationReportActionCreators.updateActivity({ id: update.activity.id, typeCode: update.activity.typeCode, startTime: update.value ? moment(update.value, "HHmm").format("HH:mm:ss") : null }, 'startTime'), // eslint-disable-line no-undef
				endTime: (update) => self.registrarReconciliationReportActionCreators.updateActivity({ id: update.activity.id, typeCode: update.activity.typeCode, endTime: update.value ? moment(update.value, "HHmm").format("HH:mm:ss") : null }, 'endTime'), // eslint-disable-line no-undef
				bannerLocation: (update) => self.registrarReconciliationReportActionCreators.updateActivity({ id: update.activity.id, typeCode: update.activity.typeCode, bannerLocation: update.value }, 'bannerLocation'),
				unassign: (update) => self.registrarReconciliationReportActionCreators.unAssignInstructor(update.section, update.instructor),
				assign: (update) => self.registrarReconciliationReportActionCreators.assignInstructor(update.section, update.instructor),
			};

			for (const update of self.$scope.pendingUpdates) {
				if (update.isChecked && updateActions[update.property]) {
					updateActions[update.property](update);
					await new Promise(resolve => setTimeout(resolve, 200)); // Add a delay between each update
				}

				self.$scope.pendingUpdates = [];
			}
		};

		for (var i = 0; i < this.$scope.allTerms.length; i++) {
			let shortTermCode = this.$scope.allTerms[i];
			let slotYear = parseInt(this.$scope.year) + 1;

			if (parseInt(shortTermCode) > 4) {
				slotYear = this.$scope.year;
			}

			let fullTerm = slotYear + shortTermCode;
			this.$scope.fullTerms.push(fullTerm);
		}

		function generateFilteredDisplay(data) {
			// filter types before setting scope state
			const uncheckedFilters = data.state.uiState.filters.filter((filter) => filter.isChecked === false);
			let filteredSectionIds = [];

			if (uncheckedFilters.length > 0) {
				// filter sections
				const hiddenTypeCodes = uncheckedFilters.map((filter) => filter.typeCode);

				filteredSectionIds = data.state.sections.ids.filter((sectionId) => {
					const slotSection = data.state.sections.list[sectionId];

					// only handling sections with 1 activity for now
					if (slotSection.activities.length === 1) {
						return !hiddenTypeCodes.includes(slotSection.activities[0].typeCode);
					}

					// pass on sections with multiple activities for now
					return true;
				});

				self.$scope.view.state.sections.filteredIds = filteredSectionIds;
			} else {
				self.$scope.view.state.sections.filteredIds =
				self.$scope.view.state.sections.ids;
			}
		}
	}

	calculateCurrentTermShortCode (termStates) {
		var earliestTermCode = null;

		termStates.forEach(function(termState) {

			if (termState.state == "ANNUAL_DRAFT") {

				if ((earliestTermCode == null) || earliestTermCode > termState.termCode) {
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

registrarReconciliationReportCtrl.$inject = ['$scope', '$rootScope', '$route', '$routeParams', 'Term', 'RegistrarReconciliationReportActionCreators', 'AuthService', 'validate'];

export default registrarReconciliationReportCtrl;
