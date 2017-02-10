teachingCallApp.service('teachingCallFormActionCreators', function (teachingCallFormStateService, teachingCallFormService, $rootScope, $window, Role) {
	return {
		getInitialState: function (workgroupId, year, tab) {
			teachingCallFormService.getInitialState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_ASSIGNMENT_VIEW,
					payload: payload,
					year: year,
					tab: tab
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		getInitialTeachingCallState: function (workgroupId, year) {
			teachingCallFormService.getInitialTeachingCallState(workgroupId, year).then(function (payload) {
				var action = {
					type: INIT_TEACHING_CALL_VIEW,
					payload: payload,
					year: year
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		initializeActiveTeachingCall: function (activeTeachingCall) {
			var action = {
				type: INIT_ACTIVE_TEACHING_CALL,
				payload: {
					activeTeachingCall: activeTeachingCall
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		updateTagFilters: function (tagIds) {
			var action = {
				type: UPDATE_TAG_FILTERS,
				payload: {
					tagIds: tagIds
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
			teachingCallFormService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
				$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
				var action = {
					type: UPDATE_TEACHING_ASSIGNMENT_ORDER,
					payload: {
						sortedTeachingAssignmentIds: sortedTeachingAssignmentIds
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
			teachingCallFormService.addScheduleInstructorNote(instructorId, year, workgroupId, comment, assignmentsCompleted).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
				var action = {
					type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		updateScheduleInstructorNote: function (scheduleInstructorNote) {
			teachingCallFormService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Updated instructor comment", type: "SUCCESS" });
				var action = {
					type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
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
				$window.location.href = instructorSummaryUrl;
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addInstructorAssignment: function (instructorId, year, workgroupId, comment) {
			var scheduleInstructorNote = {};
			scheduleInstructorNote.instructorId = instructorId;
			scheduleInstructorNote.comment = comment;

			teachingCallFormService.addScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
				$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
				var action = {
					type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
					payload: {
						scheduleInstructorNote: scheduleInstructorNote
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		removeInstructorAssignment: function (teachingAssignment) {
			teachingCallFormService.removeInstructorAssignment(sectionGroupId, instructorId).then(function (sectionGroupId) {
				$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
				var action = {
					type: REMOVE_TEACHING_ASSIGNMENT,
					payload: {
						sectionGroup: sectionGroup
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addAndApproveInstructorAssignment: function (teachingAssignment, scheduleId) {
			teachingCallFormService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
				var action = {
					type: ADD_TEACHING_ASSIGNMENT,
					payload: {
						teachingAssignment: teachingAssignment
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		approveInstructorAssignment: function (teachingAssignment, workgroupId, year) {
			var self = this;
			teachingAssignment.approved = true;

			teachingCallFormService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var action = {
						type: UPDATE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});

		},
		unapproveInstructorAssignment: function (originalTeachingAssignment) {
			originalTeachingAssignment.approved = false;
			teachingCallFormService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
				$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
				var action;
				// If unapproving a teachingPreference that was not created by the instructor, delete it instead
				if (originalTeachingAssignment.fromInstructor === false && originalTeachingAssignment.approved === false) {
					action = {
						type: REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: originalTeachingAssignment
						}
					};
					teachingCallFormStateService.reduce(action);

				} else {
					action = {
						type: UPDATE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					teachingCallFormStateService.reduce(action);
				}
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		addTeachingCallResponse: function (teachingCallResponse) {
			teachingCallFormService.addTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
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
		createTeachingCall: function (workgroupId, year, teachingCallConfig) {
			teachingCallFormService.createTeachingCall(workgroupId, year, teachingCallConfig).then(function (teachingCall) {
				$rootScope.$emit('toast', { message: "Started Teaching Call", type: "SUCCESS" });
				var action = {
					type: CREATE_TEACHING_CALL,
					payload: {
						teachingCall: teachingCall
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		deleteTeachingCall: function (teachingCall) {
			teachingCallFormService.deleteTeachingCall(teachingCall).then(function (teachingCall) {
				$rootScope.$emit('toast', { message: "Removed Teaching Call", type: "SUCCESS" });
				var action = {
					type: DELETE_TEACHING_CALL,
					payload: {
						teachingCall: teachingCall
					}
				};
				teachingCallFormStateService.reduce(action);
			}, function (err) {
				$rootScope.$emit('toast', { message: "Something went wrong. Please try again.", type: "ERROR" });
			});
		},
		showCourses: function () {
			var action = {
				type: SWITCH_MAIN_VIEW,
				payload: {
					showInstructors: false,
					showCourses: true
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		toggleDisplayCompletedInstructors: function (showCompletedInstructors) {
			var action = {
				type: TOGGLE_COMPLETED_INSTRUCTORS,
				payload: {
					showCompletedInstructors: showCompletedInstructors
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		showInstructors: function () {
			var action = {
				type: SWITCH_MAIN_VIEW,
				payload: {
					showInstructors: true,
					showCourses: false
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		toggleTermFilter: function (termId) {
			var action = {
				type: TOGGLE_TERM_FILTER,
				payload: {
					termId: termId
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		updateTableFilter: function (query) {
			var action = {
				type: UPDATE_TABLE_FILTER,
				payload: {
					query: query
				}
			};
			teachingCallFormStateService.reduce(action);
		},
		addPreference: function (teachingAssignment) {
			teachingCallFormService.addPreference(teachingAssignment).then(function (teachingAssignments) {
				$rootScope.$emit('toast', { message: "Added Preference", type: "SUCCESS" });
				var action = {
					type: ADD_PREFERENCE,
					payload: {
						teachingAssignments: teachingAssignments
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
		}
	};
});