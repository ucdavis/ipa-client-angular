/**
 * @ngdoc service
 * @name scheduleSummaryReportApp.scheduleSummaryReportActionCreators
 * @description
 * # scheduleSummaryReportActionCreators
 * Service in the scheduleSummaryReportApp.
 */
scheduleSummaryReportApp.service('scheduleSummaryReportActionCreators', function (scheduleSummaryReportStateService, scheduleSummaryReportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year, termCode) {
			scheduleSummaryReportService.getInitialState(workgroupId, year, termCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				scheduleSummaryReportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});
