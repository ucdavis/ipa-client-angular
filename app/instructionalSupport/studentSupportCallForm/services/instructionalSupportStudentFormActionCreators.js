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
		addStudentPreference: function (preference, viewState) {
			instructionalSupportStudentFormService.addStudentPreference(preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
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
		updateSupportCallResponse: function (supportCallResponse) {
			instructionalSupportStudentFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteStudentPreference: function (preference) {
			instructionalSupportStudentFormService.deleteStudentPreference(preference.id).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: DELETE_STUDENT_PREFERENCE,
					payload: preference
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		submitPreferences: function (supportCallResponse, workgroupId, year) {
			instructionalSupportStudentFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var studentSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructionalSupport";
				$window.location.href = studentSummaryUrl;
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updatePreferencesOrder: function (preferenceIds, scheduleId, termCode) {
			instructionalSupportStudentFormService.updatePreferencesOrder(preferenceIds, scheduleId, termCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCES_ORDER,
					payload: payload
				};
				instructionalSupportStudentFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		pretendToastMessage: function () {
			$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
		}

	};
});