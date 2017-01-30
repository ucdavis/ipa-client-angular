teachingCallResponseReportApp.service('teachingCallResponseReportActionCreators', function (scheduleSummaryReportStateService, scheduleSummaryReportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			teachingCallResponseReportService.getInitialState(workgroupId, year, termCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				teachingCallResponseReportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});
