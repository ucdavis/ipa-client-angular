instructionalSupportApp.service('supportStaffFormActionCreators', function ($rootScope, $window, supportStaffFormService, supportStaffFormStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			supportStaffFormService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not load support staff form initial state.", type: "ERROR" });
			});
		},
		addStudentPreference: function (preference) {
			supportStaffFormService.addStudentPreference(preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_STUDENT_PREFERENCE,
					payload: payload
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not add preference.", type: "ERROR" });
			});
		},
		updateSupportCallResponse: function (supportCallResponse) {
			supportStaffFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		deleteStudentPreference: function (preference) {
			supportStaffFormService.deleteStudentPreference(preference.id).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: DELETE_STUDENT_PREFERENCE,
					payload: preference
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not remove preference.", type: "ERROR" });
			});
		},
		submitPreferences: function (supportCallResponse, workgroupId, year) {
			supportStaffFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var studentSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructionalSupport";
				$window.location.href = studentSummaryUrl;
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
			});
		},
		updatePreferencesOrder: function (preferenceIds, scheduleId, termCode) {
			supportStaffFormService.updatePreferencesOrder(preferenceIds, scheduleId, termCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCES_ORDER,
					payload: payload
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preference order.", type: "ERROR" });
			});
		},
		updatePreference: function (scheduleId, preference) {
			supportStaffFormService.updatePreference(scheduleId, preference).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preference comments", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCE,
					payload: payload
				};
				supportStaffFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Could not update preference comments.", type: "ERROR" });
			});
		},
		pretendToastMessage: function () {
			$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
		}
	};
});