teachingCallApp.service('teachingCallFormActionCreators', function (teachingCallFormStateService, teachingCallFormService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			teachingCallFormService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_STATE,
					payload: payload,
					year: year,
					tab: tab
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId, termCode) {
			teachingCallFormService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
				$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_ASSIGNMENT_ORDER,
					payload: {
						sortedTeachingAssignmentIds: sortedTeachingAssignmentIds,
						termCode: termCode
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateTeachingCallResponse: function (teachingCallResponse) {
			teachingCallFormService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
				$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_CALL_RESPONSE,
					payload: {
						teachingCallResponse: teachingCallResponse
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateTeachingCallReceipt: function (teachingCallReceipt) {
			teachingCallFormService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
				$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_CALL_RECEIPT,
					payload: {
						teachingCallReceipt: teachingCallReceipt
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		submitTeachingCall: function (teachingCallReceipt, workgroupId, year) {
			teachingCallFormService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
				var instructorSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructor";
				$rootScope.$emit('toast', { message: "Preferences saved.", type: "SUCCESS" });
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		createAvailability: function (teachingCallResponse) {
			teachingCallFormService.createAvailability(teachingCallResponse).then(function (teachingCallResponse) {
				$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });

				var action = {
					type: ADD_TEACHING_CALL_RESPONSE,
					payload: {
						teachingCallResponse: teachingCallResponse
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addPreference: function (teachingAssignment, termCode) {
			teachingCallFormService.addPreference(teachingAssignment).then(function (teachingAssignments) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_PREFERENCE,
					payload: {
						teachingAssignments: teachingAssignments,
						termCode: termCode
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removePreference: function (teachingAssignment) {
			teachingCallFormService.removePreference(teachingAssignment).then(function (teachingAssignments) {
				$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
				var action = {
					type: REMOVE_PREFERENCE,
					payload: {
						teachingAssignments: teachingAssignments,
						instructorId: teachingAssignment.instructorId,
						termCode: teachingAssignment.termCode
					}
				};

				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		changeTerm: function (termCode) {
			var action = {
				type: CHANGE_TERM,
				payload: {
					selectedTermCode: termCode
				}
			};

			teachingCallFormStateService.reduce(action);
		},
		pretendSubmitForm: function () {
			var action = {
				type: PRETEND_SUBMIT_FORM,
				payload: {}
			};
			$rootScope.$emit('toast', { message: "Preferences saved.", type: "SUCCESS" });
			teachingCallFormStateService.reduce(action);
		}
	};
});