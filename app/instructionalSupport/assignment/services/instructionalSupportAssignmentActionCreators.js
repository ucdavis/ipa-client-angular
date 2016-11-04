instructionalSupportApp.service('instructionalSupportAssignmentActionCreators', function ($rootScope, $window, instructionalSupportAssignmentService, instructionalSupportAssignmentStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode, tab) {
			instructionalSupportAssignmentService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				instructionalSupportAssignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updatePreference: function (instructionalSupportAssignment) {
			return null;
		}
	};
});