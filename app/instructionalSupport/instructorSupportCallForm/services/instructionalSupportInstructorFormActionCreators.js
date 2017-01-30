instructionalSupportApp.service('instructionalSupportInstructorFormActionCreators', function ($rootScope, $window, instructionalSupportInstructorFormService, instructionalSupportInstructorFormStateService) {
	return {
		getInitialState: function (workgroupId, year, termShortCode) {
			instructionalSupportInstructorFormService.getInitialState(workgroupId, year, termShortCode).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year
				};
				instructionalSupportInstructorFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addInstructorPreference: function (sectionGroupId, supportStaffId, supportCallId) {
			instructionalSupportInstructorFormService.addInstructorPreference(sectionGroupId, supportStaffId, supportCallId).then(function (newPreference) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_INSTRUCTOR_PREFERENCE,
					payload:  {
						newPreference: newPreference
					}
				};
				instructionalSupportInstructorFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateSupportCallResponse: function (supportCallResponse) {
			instructionalSupportInstructorFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_SUPPORT_CALL_RESPONSE,
					payload: payload
				};
				instructionalSupportInstructorFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteInstructorPreference: function (preference, studentPreferences) {
			instructionalSupportInstructorFormService.deleteInstructorPreference(preference.id).then(function (payload) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: DELETE_INSTRUCTOR_PREFERENCE,
					payload: {
						preference: preference,
						studentPreferences: studentPreferences
					}
				};
				instructionalSupportInstructorFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		submitInstructorPreferences: function (supportCallResponse, workgroupId, year) {
			instructionalSupportInstructorFormService.updateSupportCallResponse(supportCallResponse).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });

				var instructorSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructor";
				$window.location.href = instructorSummaryUrl;
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateInstructorPreferencesOrder: function (preferenceIds, scheduleId, termCode) {
			instructionalSupportInstructorFormService.updatePreferencesOrder(preferenceIds, scheduleId, termCode).then(function (payload) {
				$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_PREFERENCES_ORDER,
					payload: payload
				};
				instructionalSupportInstructorFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		pretendToastMessage: function () {
			$rootScope.$emit('toast', { message: "Updated preferences", type: "SUCCESS" });
		}
	};
});