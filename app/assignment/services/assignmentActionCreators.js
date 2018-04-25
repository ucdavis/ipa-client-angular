/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
class AssignmentActionCreators {
	constructor (AssignmentStateService, AssignmentService, $rootScope, $window, Role, ActionTypes) {
		var self = this;
		this.assignmentStateService = AssignmentStateService;
		this.assignmentService = AssignmentService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.Role = Role;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year, tab) {
				self.assignmentService.getInitialState(workgroupId, year).then(function (payload) {
					var action = {
						type: ActionTypes.INIT_ASSIGNMENT_VIEW,
						payload: payload,
						year: year,
						tab: tab
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not load assignment view.", type: "ERROR" });
				});
			},
			updateTagFilters: function (tagIds) {
				var action = {
					type: UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds
					}
				};
				self.assignmentStateService.reduce(action);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				self.assignmentService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
					$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
					var action = {
						type: UPDATE_TEACHING_ASSIGNMENT_ORDER,
						payload: {
							sortedTeachingAssignmentIds: sortedTeachingAssignmentIds
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update assignment order.", type: "ERROR" });
				});
			},
			addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
				self.assignmentService.addScheduleInstructorNote(instructorId, year, workgroupId, comment, assignmentsCompleted).then(function (scheduleInstructorNote) {
					self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},
			updateScheduleInstructorNote: function (scheduleInstructorNote) {
				self.assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					self.$rootScope.$emit('toast', { message: "Updated instructor comment", type: "SUCCESS" });
					var action = {
						type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update instructor comment.", type: "ERROR" });
				});
			},
			markInstructorComplete: function (scheduleInstructorNote) {
				self.assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					self.$rootScope.$emit('toast', { message: "Instructor marked completed", type: "SUCCESS" });
					var action = {
						type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not mark instructor complete.", type: "ERROR" });
				});
			},
			markInstructorIncomplete: function (scheduleInstructorNote) {
				self.assignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					self.$rootScope.$emit('toast', { message: "Instructor marked incomplete", type: "SUCCESS" });
					var action = {
						type: UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not mark instructor incomplete.", type: "ERROR" });
				});
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				self.assignmentService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					self.$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
					var action = {
						type: UPDATE_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				self.assignmentService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
					self.$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
					var action = {
						type: UPDATE_TEACHING_CALL_RECEIPT,
						payload: {
							teachingCallReceipt: teachingCallReceipt
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
				});
			},
			addInstructorAssignment: function (instructorId, year, workgroupId, comment) {
				var scheduleInstructorNote = {};
				scheduleInstructorNote.instructorId = instructorId;
				scheduleInstructorNote.comment = comment;
	
				self.assignmentService.addScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},
			removeInstructorAssignment: function (teachingAssignment) {
				self.assignmentService.removeInstructorAssignment(sectionGroupId, instructorId).then(function (sectionGroupId) {
					self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
					var action = {
						type: REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							sectionGroup: sectionGroup
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			addAndApproveInstructorAssignment: function (teachingAssignment, scheduleId) {
				self.assignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (teachingAssignment) {
					self.$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var action = {
						type: ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},
			assignInstructorType: function (teachingAssignment) {
				var scheduleId = assignmentStateService._state.userInterface.scheduleId;
	
				self.assignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (newTeachingAssignment) {
					self.$rootScope.$emit('toast', { message: "Assigned instructor type", type: "SUCCESS" });
					self.assignmentStateService.reduce({
						type: ActionTypes.ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: newTeachingAssignment
						}
					});
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not assign instructor type.", type: "ERROR" });
				});
			},
			unassignInstructorType: function (originalTeachingAssignment) {
				self.assignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
					self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
	
					self.assignmentStateService.reduce({
						type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: originalTeachingAssignment
						}
					});
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			assignStudentToAssociateInstructor: function (sectionGroup, supportStaff) {
				var self = this;
	
				self.assignmentService.assignStudentToAssociateInstructor(sectionGroup.id, supportStaff.id).then(function (teachingAssignment) {
					self.$rootScope.$emit('toast', { message: "Assigned Associate Instructor", type: "SUCCESS" });
	
					var instructor = {
						id: teachingAssignment.instructorId,
						firstName: supportStaff.firstName,
						lastName: supportStaff.lastName,
						fullName: supportStaff.fullName,
						email: supportStaff.emailAddress,
						loginId: supportStaff.loginId
					};
	
					self.assignmentStateService.reduce({
						type: ASSIGN_ASSOCIATE_INSTRUCTOR,
						payload: {
							teachingAssignment: teachingAssignment,
							instructor: instructor,
							year: assignmentStateService._state.userInterface.year
						}
					});
	
						self.addAndApproveInstructorAssignment(teachingAssignment, assignmentStateService._state.userInterface.scheduleId);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			approveInstructorAssignment: function (teachingAssignment, workgroupId, year) {
				var self = this;
				teachingAssignment.approved = true;
	
				self.assignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
					$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
						var action = {
							type: UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},
			createPlaceholderStaff: function (sectionGroup) {
				self.assignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					self.$rootScope.$emit('toast', { message: "Assigned The Staff", type: "SUCCESS" });
						var action = {
							type: CREATE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not assign The Staff.", type: "ERROR" });
				});
			},
			removePlaceholderStaff: function (sectionGroup) {
				self.assignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					self.$rootScope.$emit('toast', { message: "Removed The Staff", type: "SUCCESS" });
						var action = {
							type: REMOVE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove The Staff.", type: "ERROR" });
				});
			},
			unapproveInstructorAssignment: function (originalTeachingAssignment) {
				originalTeachingAssignment.approved = false;
				self.assignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
					self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
					var action;
					// If unapproving a teachingPreference that was not created by the instructor, delete it instead
					if (originalTeachingAssignment.fromInstructor === false && originalTeachingAssignment.approved === false) {
						action = {
							type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: originalTeachingAssignment
							}
						};
						self.assignmentStateService.reduce(action);
	
					} else {
						action = {
							type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						self.assignmentStateService.reduce(action);
					}
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			addTeachingCallResponse: function (teachingCallResponse) {
				self.assignmentService.addTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					self.$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					self.assignmentStateService.reduce(action);
				}, function (err) {
					self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			showCourses: function () {
				var action = {
					type: ActionTypes.SWITCH_MAIN_VIEW,
					payload: {
						showInstructors: false,
						showCourses: true
					}
				};
				self.assignmentStateService.reduce(action);
			},
			toggleDisplayCompletedInstructors: function (showCompletedInstructors) {
				var action = {
					type: ActionTypes.TOGGLE_COMPLETED_INSTRUCTORS,
					payload: {
						showCompletedInstructors: showCompletedInstructors
					}
				};
				self.assignmentStateService.reduce(action);
			},
			showInstructors: function () {
				var action = {
					type: ActionTypes.SWITCH_MAIN_VIEW,
					payload: {
						showInstructors: true,
						showCourses: false
					}
				};
				self.assignmentStateService.reduce(action);
			},
			toggleTermFilter: function (termId) {
				var action = {
					type: ActionTypes.TOGGLE_TERM_FILTER,
					payload: {
						termId: termId
					}
				};
				self.assignmentStateService.reduce(action);
			},
			updateTableFilter: function (query) {
				var action = {
					type: ActionTypes.UPDATE_TABLE_FILTER,
					payload: {
						query: query
					}
				};
				self.assignmentStateService.reduce(action);
			}
		};
	}
}

AssignmentActionCreators.$inject = ['AssignmentStateService', 'AssignmentService', '$rootScope', '$window', 'Role', 'ActionTypes'];

export default AssignmentActionCreators;
