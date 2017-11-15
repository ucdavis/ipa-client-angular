/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
summaryApp.service('summaryActionCreators', function (summaryStateService, summaryService, $rootScope, Role) {
	return {
		getInitialState: function (workgroupId, year) {
			summaryService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					workgroupId: workgroupId
				};
				summaryStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load summary initial state.", type: "ERROR" });
			});
		},
		selectTerm: function(term) {
			summaryStateService.reduce({
				type: SELECT_TERM,
				payload: {
					selectedTerm: term
				}
			});
		}
	};
});
