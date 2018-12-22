import { millisecondsToDate } from 'shared/helpers/dates';

class StudentFormReducers {
	constructor ($rootScope, $log, StudentFormSelectors, ActionTypes) {
		this.$rootScope = $rootScope;
		this.$log = $log;
		this.StudentFormSelectors = StudentFormSelectors;
		this.ActionTypes = ActionTypes;

		return {
			_state: {},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						sectionGroups = {
							ids: [],
							list: {}
						};
						action.payload.sectionGroups.forEach( function(sectionGroup) {
							sectionGroups.ids.push(sectionGroup.id);
							sectionGroups.list[sectionGroup.id] = sectionGroup;
						});
						return sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						courses = {
							ids: [],
							list: {}
						};
						action.payload.courses.forEach( function(course) {
							courses.ids.push(course.id);
							courses.list[course.id] = course;
						});
						return courses;
					default:
						return courses;
				}
			},
			_preferenceReducers: function (action, preferences) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						preferences = {
							ids: [],
							list: {}
						};
						action.payload.studentSupportPreferences.forEach( function(preference) {
							preferences.ids.push(preference.id);
							preferences.list[preference.id] = preference;
						});
						return preferences;
					case ActionTypes.UPDATE_PREFERENCES_ORDER:
						for (var i = 0; i < action.payload.length; i++) {
							var preferenceId = action.payload[i];
							var priority = i + 1;
							preferences.list[preferenceId].priority = priority;
						}
						return preferences;
					case ActionTypes.UPDATE_PREFERENCE:
						var preference = action.payload;
						preferences.list[preference.id] = preference;
						return preferences;
					case ActionTypes.ADD_STUDENT_PREFERENCE:
						var preference = action.payload;
						preferences.ids.push(preference.id);
						preferences.list[preference.id] = preference;
						return preferences;
					case ActionTypes.DELETE_STUDENT_PREFERENCE:
						var preference = action.payload;
						var index = preferences.ids.indexOf(preference.id);
						preferences.ids.splice(index, 1);
						var priority = preference.priority;
						preferences.ids.forEach(function(slotPreferenceId) {
							var slotPreference = preferences.list[slotPreferenceId];
							if (slotPreference.priority > priority) {
								slotPreference.priority--;
							}
						});
						return preferences;
					default:
						return preferences;
				}
			},
			_supportAssignmentReducers: function (action, supportAssignments) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportAssignments = {
							ids: [],
							list: {}
						};
						action.payload.supportAssignments.forEach( function(supportAssignment) {
							supportAssignments.ids.push(supportAssignment.id);
							supportAssignments.list[supportAssignment.id] = supportAssignment;
						});
						return supportAssignments;
					default:
						return supportAssignments;
				}
			},
			_miscReducers: function (action, misc) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						misc = {
							scheduleId: action.payload.scheduleId,
							supportStaffId: action.payload.supportStaffId,
							workgroupId: action.workgroupId,
							year: action.year,
							termShortCode: action.termShortCode,
							termCode: action.year + action.termShortCode
						};
						return misc;
					default:
						return misc;
				}
			},
			_uiReducers: function (action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						// Return default ui object if studentSupportCallResponse is not present
						// In this case the page will display a warning that you were not invited to a support call
						if (action.payload.studentSupportCallResponse == null || action.payload.studentSupportCallResponse == false) {
							return {
								isPreferenceCommentModalOpen: false,
								isFormLocked: false,
								crnSearch: {
									crn: null,
									feedback: null,
									blob: null,
									displayTimes: null
								},
								review: {
									isFormValid: true,
									validationErrorMessage: null,
									requirePreferenceAmount: {
										required: false,
										complete: false
									},
									requireEligible: {
										required: false,
										complete: false
									},
									requirePreferenceComments: {
										required: false,
										complete: false,
										disabled: false
									}
								}
							};
						}
						var preferenceCommentsComplete = true;
						var preferenceCommentsDisabled = false;

						if (action.payload.studentSupportPreferences.length > 0) {
							action.payload.studentSupportPreferences.forEach(function(preference) {
								if (!(preference.comment) || preference.comment.length == 0) { preferenceCommentsComplete = false; }
							});
						} else {
							preferenceCommentsComplete = false;
							preferenceCommentsDisabled = true;
						}
	
						ui = {
							isPreferenceCommentModalOpen: false,
							isFormLocked: false,
							crnSearch: {
								feedback: null,
								blob: null,
								displayTimes: null
							},
							review: {
								isFormValid: true,
								validationErrorMessage: null,
								requirePreferenceAmount: {
									required: action.payload.studentSupportCallResponse.minimumNumberOfPreferences > 0,
									complete: action.payload.studentSupportPreferences.length >= action.payload.studentSupportCallResponse.minimumNumberOfPreferences
								},
								requireEligible: {
									required: action.payload.studentSupportCallResponse.collectEligibilityConfirmation,
									complete: action.payload.studentSupportCallResponse.eligibilityConfirmed
								},
								requirePreferenceComments: {
									required: action.payload.studentSupportCallResponse.requirePreferenceComments,
									complete: preferenceCommentsComplete,
									disabled: preferenceCommentsDisabled
								}
							}
						};
	
						// Determine if form should be locked (due date is enforced and has passed)
						var dueDate = action.payload.studentSupportCallResponse.dueDate;
						var dueDateEnforced = action.payload.studentSupportCallResponse.allowSubmissionAfterDueDate == false;
						if (dueDate && dueDateEnforced) {
							var currentTime = new Date().getTime();
							if (currentTime > dueDate) {
								ui.isFormLocked = true;
							}
						}
	
						return ui;
					case ActionTypes.CLEAR_CRN_SEARCH:
						ui.crnSearch.feedback = null;
						ui.crnSearch.blob = null;
						ui.crnSearch.displayTimes = null;
						return ui;
					case ActionTypes.CALCULATE_FORM_VALID:
						ui.review.isFormValid = action.payload.isFormValid;
						ui.review.validationErrorMessage = action.payload.validationErrorMessage;
						return ui;
					case ActionTypes.BEGIN_FETCH_ACTIVITIES_BY_CRN:
						ui.crnSearch.feedback = null;
						ui.crnSearch.blob = null;
						ui.crnSearch.displayTimes = null;
						return ui;
					case ActionTypes.CALCULATE_TIMESLOTS_FOR_CRN:
						ui.crnSearch.feedback = action.payload.crnSearchFeedback;
						ui.crnSearch.blob = action.payload.crnSearchBlob;
						ui.crnSearch.displayTimes = action.payload.crnSearchTimes;
						return ui;
					case ActionTypes.OPEN_PREFERENCE_COMMENT_MODAL:
						ui.isPreferenceCommentModalOpen = true;
						ui.modalPreference = action.payload.preference;
						return ui;
					case ActionTypes.CLOSE_PREFERENCE_COMMENT_MODAL:
						ui.isPreferenceCommentModalOpen = false;
						ui.modalPreference = null;
						return ui;
					case ActionTypes.ADD_STUDENT_PREFERENCE:
					case ActionTypes.DELETE_STUDENT_PREFERENCE:
						ui.review.requirePreferenceAmount.complete = action.preferences.ids.length >= action.supportCallResponse.minimumNumberOfPreferences;
						return ui;
					case ActionTypes.UPDATE_PREFERENCE_COMMENT_VALIDATION:
						ui.review.requirePreferenceComments.complete = action.payload.preferenceCommentsComplete;
						ui.review.requirePreferenceComments.disabled = action.payload.preferenceCommentsDisabled;
						return ui;
					case ActionTypes.UPDATE_SUPPORT_CALL_RESPONSE:
						ui.review.requireEligible.complete = action.payload.eligibilityConfirmed;
						return ui;
					default:
						return ui;
				}
			},
			_supportCallResponseReducers: function (action, supportCallResponse) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						supportCallResponse = action.payload.studentSupportCallResponse;
						if (!supportCallResponse) {
							return null;
						}
						if (!supportCallResponse.availabilityBlob) {
							supportCallResponse.availabilityBlob =
									"1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,"
								+ "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,"
								+ "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,"
								+ "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,"
								+ "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1";
						}
	
						supportCallResponse.dueDateDescription = supportCallResponse.dueDate ? millisecondsToDate(supportCallResponse.dueDate) : "";
						return supportCallResponse;
					case ActionTypes.UPDATE_SUPPORT_CALL_RESPONSE:
						supportCallResponse = action.payload;
						supportCallResponse.dueDateDescription = supportCallResponse.dueDate ? millisecondsToDate(supportCallResponse.dueDate) : "";
						return supportCallResponse;
					default:
						return supportCallResponse;
				}
			},
			reduce: function (action) {
				var scope = this;
	
				let newState = {};
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.supportAssignments = scope._supportAssignmentReducers(action, scope._state.supportAssignments);
				newState.misc = scope._miscReducers(action, scope._state.misc);
				newState.preferences = scope._preferenceReducers(action, scope._state.preferences);
				newState.supportCallResponse = scope._supportCallResponseReducers(action, scope._state.supportCallResponse);
				newState.ui = scope._uiReducers(action, scope._state.ui);
	
				scope._state = newState;
	
				// Build new 'page state'
				// This is the 'view friendly' version of the store
				let newPageState = {};
				newPageState.ui = angular.copy(scope._state.ui); // eslint-disable-line no-undef
				newPageState.courses = angular.copy(scope._state.courses); // eslint-disable-line no-undef
				newPageState.sectionGroups = angular.copy(scope._state.sectionGroups); // eslint-disable-line no-undef
	
				newPageState.supportCallResponse = angular.copy(scope._state.supportCallResponse); // eslint-disable-line no-undef
				newPageState.misc = angular.copy(scope._state.misc); // eslint-disable-line no-undef
				newPageState.supportAssignments = angular.copy(scope._state.supportAssignments); // eslint-disable-line no-undef
	
				newPageState.preferences = StudentFormSelectors.generatePreferences(
																															scope._state.preferences,
																															scope._state.courses,
																															scope._state.sectionGroups
																														);
	
				newPageState.potentialPreferences = StudentFormSelectors.generatePotentialPreferences(
																																				scope._state.supportAssignments,
																																				scope._state.courses,
																																				scope._state.sectionGroups,
																																				scope._state.preferences,
																																				scope._state.supportCallResponse
																																			);
	
				$rootScope.$emit('studentStateChanged', newPageState);
			}
		};
	}
}

StudentFormReducers.$inject = ['$rootScope', '$log', 'StudentFormSelectors', 'ActionTypes'];

export default StudentFormReducers;
