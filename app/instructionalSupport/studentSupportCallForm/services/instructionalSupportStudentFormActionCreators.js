instructionalSupportApp.service('instructionalSupportStudentFormActionCreators', function ($rootScope, $window, instructionalSupportStudentFormService, instructionalSupportStudentFormStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			instructionalSupportStudentFormService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addStudentPreference: function (preference, viewState, supportCallId) {
			instructionalSupportStudentFormService.addStudentPreference(preference, supportCallId).then(function (payload) {
				var action = {
					type: ADD_STUDENT_PREFERENCE,
					payload: payload,
					viewState: viewState
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteStudentPreference: function (preference) {
			instructionalSupportStudentFormService.deleteStudentPreference(preference.id).then(function (payload) {
				var action = {
					type: DELETE_STUDENT_PREFERENCE,
					payload: preference
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		}
	};
});