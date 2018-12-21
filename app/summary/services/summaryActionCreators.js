/**
 * @ngdoc service
 * @name SummaryApp.SummaryActionCreators
 * @description
 * # SummaryActionCreators
 * Service in the SummaryApp.
 */
class summaryActionCreators {
	constructor (SummaryStateService, SummaryService, $rootScope, Role, ActionTypes) {
		var self = this;
		this.summaryStateService = SummaryStateService;
		this.summaryService = SummaryService;
		this.$rootScope = $rootScope;
		this.Role = Role;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year) {
				self.summaryService.getInitialState(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload,
						year: year,
						workgroupId: workgroupId
					};
					self.summaryStateService.reduce(action);
				}, function () {
					self.$rootScope.$emit('toast', { message: "Could not load summary initial state.", type: "ERROR" });
				});
			},
			selectTerm: function(term) {
				self.summaryStateService.reduce({
					type: ActionTypes.SELECT_TERM,
					payload: {
						selectedTerm: term
					}
				});
			}
		};	
	}
}

summaryActionCreators.$inject = ['SummaryStateService', 'SummaryService', '$rootScope', 'Role', 'ActionTypes'];

export default summaryActionCreators;
