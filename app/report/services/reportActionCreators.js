/**
 * @ngdoc service
 * @name reportApp.reportActionCreators
 * @description
 * # reportActionCreators
 * Service in the reportApp.
 * Central location for sharedState information.
 */
reportApp.service('reportActionCreators', function (reportStateService, reportService, $rootScope) {
	return {
		getInitialState: function (workgroupId, year) {
			reportService.getSchedulesToCompare(workgroupId).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		beginComparison: function () {
			var action = {
				type: BEGIN_COMPARISON,
				payload: {}
			};
			reportStateService.reduce(action);
		},
		getTermComparisonReport: function (workgroupId, year, termCode) {
			reportService.getTermComparisonReport(workgroupId, year, termCode).then(function (payload) {
				var action = {
					type: GET_TERM_COMPARISON_REPORT,
					payload: payload
				};
				reportStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});
