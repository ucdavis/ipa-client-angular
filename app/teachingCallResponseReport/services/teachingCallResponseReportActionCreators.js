class TeachingCallResponseReportActionCreators {
	constructor(teachingCallResponseReportStateService, teachingCallResponseReportService, $rootScope, ActionTypes, $route) {
		this.teachingCallResponseReportStateService = teachingCallResponseReportStateService;
		this.teachingCallResponseReportService = teachingCallResponseReportService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year) {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

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

TeachingCallResponseReportActionCreators.$inject = ['TeachingCallResponseReportStateService', 'TeachingCallResponseReportService', '$rootScope', 'ActionTypes', '$route'];

export default TeachingCallResponseReportActionCreators;