class TeachingCallFormActionCreators {
	constructor (TeachingCallFormStateService, TeachingCallFormService, $rootScope, $window, Role, ActionTypes, $route) {
		return {
			getInitialState: function (workgroupId, year, tab) {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;

				TeachingCallFormService.getInitialState(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_STATE,
						payload: payload,
						year: year,
						tab: tab
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not get teaching call form initial state.", type: "ERROR" });
				});
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId, termCode) {
				TeachingCallFormService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
					$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT_ORDER,
						payload: {
							sortedTeachingAssignmentIds: sortedTeachingAssignmentIds,
							termCode: termCode
						}
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update order of assignments.", type: "ERROR" });
				});
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				TeachingCallFormService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					ipa_analyze_event('teaching call form', 'availabilities set');

					$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},

			/**
			 * Called when comments are modified or 'Submit' button is clicked.
			 * 
			 * @param {*} teachingCallReceipt 
			 */
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				TeachingCallFormService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
					ipa_analyze_event('teaching call form', 'teaching call receipt updated');

					$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RECEIPT,
						payload: {
							teachingCallReceipt: teachingCallReceipt
						}
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
				});
			},
			submitTeachingCall: function (teachingCallReceipt, workgroupId, year) {
				TeachingCallFormService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
					var instructorSummaryUrl = "/summary/" + workgroupId + "/" + year + "?mode=instructor&submittedTC=true";
					$window.location.href = instructorSummaryUrl;
					$rootScope.$emit('toast', { message: "Preferences saved.", type: "SUCCESS" });
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not save preferences.", type: "ERROR" });
				});
			},
			createAvailability: function (teachingCallResponse) {
				TeachingCallFormService.createAvailability(teachingCallResponse).then(function (teachingCallResponse) {
					ipa_analyze_event('teaching call form', 'availabilities set');

					$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });
	
					var action = {
						type: ActionTypes.ADD_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			addPreference: function (teachingAssignment, termCode) {
				TeachingCallFormService.addPreference(teachingAssignment).then(function (teachingAssignments) {
					ipa_analyze_event('teaching call form', 'preference added');

					$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_PREFERENCE,
						payload: {
							teachingAssignments: teachingAssignments,
							termCode: termCode
						}
					};
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not add preference.", type: "ERROR" });
				});
			},
			removePreference: function (teachingAssignment) {
				TeachingCallFormService.removePreference(teachingAssignment).then(function (teachingAssignments) {
					ipa_analyze_event('teaching call form', 'preference removed');

					$rootScope.$emit('toast', { message: "Removed Preference", type: "SUCCESS" });
					var action = {
						type: ActionTypes.REMOVE_PREFERENCE,
						payload: {
							teachingAssignments: teachingAssignments,
							instructorId: teachingAssignment.instructorId,
							termCode: teachingAssignment.termCode
						}
					};
	
					TeachingCallFormStateService.reduce(action);
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not remove preference.", type: "ERROR" });
				});
			},
			changeTerm: function (termCode) {
				var action = {
					type: ActionTypes.CHANGE_TERM,
					payload: {
						selectedTermCode: termCode
					}
				};
	
				TeachingCallFormStateService.reduce(action);
			},
			pretendSubmitForm: function () {
				var action = {
					type: ActionTypes.PRETEND_SUBMIT_FORM,
					payload: {}
				};
				$rootScope.$emit('toast', { message: "Preferences saved.", type: "SUCCESS" });
				TeachingCallFormStateService.reduce(action);
			}
		};
	}
}

export default TeachingCallFormActionCreators;
