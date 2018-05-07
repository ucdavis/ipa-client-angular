class TeachingCallResponseReportActionCreators {
	constructor(teachingCallResponseReportStateService, teachingCallResponseReportService, $rootScope, ActionTypes) {
		this.teachingCallResponseReportStateService = teachingCallResponseReportStateService;
		this.teachingCallResponseReportService = teachingCallResponseReportService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year, termCode) {
				teachingCallResponseReportService.getInitialState(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload,
						year: year
					};
					teachingCallResponseReportStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load teaching call response report initial state.", type: "ERROR" });
				});
			}
		};	
	}
}

TeachingCallResponseReportActionCreators.$inject = ['TeachingCallResponseReportStateService', 'TeachingCallResponseReportService', '$rootScope', 'ActionTypes'];

export default TeachingCallResponseReportActionCreators;