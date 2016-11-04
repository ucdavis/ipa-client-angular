/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
instructionalSupportApp.service('instructionalSupportAssignmentActionCreators', function ($rootScope, $window) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			/*
			assignmentService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_ASSIGNMENT_VIEW,
					payload: payload,
					year: year,
					tab: tab
				};
				assignmentStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
			*/
			return null;
		},
		updatePreference: function (instructionalSupportAssignment) {
			return null;
		}
	};
});