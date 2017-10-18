teachingCallResponseReportApp.service('teachingCallResponseReportActionCreators', function (teachingCallResponseReportStateService, teachingCallResponseReportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			teachingCallResponseReportService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				teachingCallResponseReportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load teaching call response report initial state.", type: "ERROR" });
			});
		}
	};
});
