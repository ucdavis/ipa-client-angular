/**
 * @ngdoc service
 * @name workgroupApp.workgroupActionCreators
 * @description
 * # workgroupActionCreators
 * Service in the workgroupApp.
 * Central location for sharedState information.
 */
class AssignmentActionCreators {
	constructor (AssignmentStateService, $route, AssignmentService, $rootScope, $window, Role, ActionTypes) {
		var _self = this;
		this.AssignmentStateService = AssignmentStateService;
		this.AssignmentService = AssignmentService;
		this.$rootScope = $rootScope;
		this.$window = $window;
		this.Role = Role;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function () {
				var workgroupId = $route.current.params.workgroupId;
				var year = $route.current.params.year;
				var tab = $route.current.params.tab;

				_self.AssignmentService.getInitialState(workgroupId, year).then(function (payload) {
					var usersMap = new Map();
					for (var user in payload.users) {
						usersMap.set(payload.users[user].loginId, payload.users[user].id);
					}

					var userRolesMap = new Map();
					for (var userRole in payload.userRoles) {
						if(payload.userRoles[userRole].role == "instructor") {
							userRolesMap.set(payload.userRoles[userRole].userId, payload.userRoles[userRole].role);
						}
					}

					for (var instructor in payload.instructors) {
						payload.instructors[instructor].isAssignable = false;
						var userId = usersMap.get(payload.instructors[instructor].loginId);

						if (userRolesMap.get(userId)) {
							payload.instructors[instructor].isAssignable = true;
						}
					}

					var action = {
						type: ActionTypes.INIT_ASSIGNMENT_VIEW,
						payload: payload,
						year: year,
						tab: tab
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not load assignment view.", type: "ERROR" });
				});
			},
			updateCourseNote: function (courseId, note) {
				var course = AssignmentStateService._state.courses.list[courseId];
				course.note = note;
				_self.AssignmentService.updateCourse(course).then(function (newCourse) {
					ipa_analyze_event('instructor assignments', 'course note updated');

					_self.$rootScope.$emit('toast', { message: "Updated course note", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_COURSE_NOTE,
						payload: {
							course: newCourse
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update course note.", type: "ERROR" });
				});
			},
			updateTagFilters: function (tagIds) {
				var action = {
					type: ActionTypes.UPDATE_TAG_FILTERS,
					payload: {
						tagIds: tagIds
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			updateAssignmentsOrder: function (sortedTeachingAssignmentIds, scheduleId) {
				_self.AssignmentService.updateAssignmentsOrder(sortedTeachingAssignmentIds, scheduleId).then(function (sortedTeachingAssignmentIds) {
					$rootScope.$emit('toast', { message: "Updated Assignment Priority", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT_ORDER,
						payload: {
							sortedTeachingAssignmentIds: sortedTeachingAssignmentIds
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update assignment order.", type: "ERROR" });
				});
			},
			createOrUpdateScheduleInstructorNote: function (instructorId, scheduleId, note, scheduleInstructorNoteId) {
				var _this = this;
				var scheduleInstructorNote = _self.AssignmentStateService._state.scheduleInstructorNotes.list[scheduleInstructorNoteId];

				if (scheduleInstructorNote) {
					scheduleInstructorNote.instructorComment = note;
					_this.updateScheduleInstructorNote(scheduleInstructorNote);
				} else {
					var year = $route.current.params.year;
					var workgroupId = $route.current.params.workgroupId;
					_this.addScheduleInstructorNote(instructorId, year, workgroupId, note, assignmentsCompleted);
				}
			},
			addScheduleInstructorNote: function (instructorId, year, workgroupId, comment, assignmentsCompleted) {
				_self.AssignmentService.addScheduleInstructorNote(instructorId, year, workgroupId, comment, assignmentsCompleted).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},
			updateScheduleInstructorNote: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Updated instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update instructor comment.", type: "ERROR" });
				});
			},
			markInstructorComplete: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Instructor marked completed", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not mark instructor complete.", type: "ERROR" });
				});
			},
			markInstructorIncomplete: function (scheduleInstructorNote) {
				_self.AssignmentService.updateScheduleInstructorNote(scheduleInstructorNote).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Instructor marked incomplete", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not mark instructor incomplete.", type: "ERROR" });
				});
			},
			updateTeachingCallResponse: function (teachingCallResponse) {
				_self.AssignmentService.updateTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					_self.$rootScope.$emit('toast', { message: "Updated availabilities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
				});
			},
			updateTeachingCallReceipt: function (teachingCallReceipt) {
				_self.AssignmentService.updateTeachingCallReceipt(teachingCallReceipt).then(function (teachingCallReceipt) {
					_self.$rootScope.$emit('toast', { message: "Updated Preferences", type: "SUCCESS" });
					var action = {
						type: ActionTypes.UPDATE_TEACHING_CALL_RECEIPT,
						payload: {
							teachingCallReceipt: teachingCallReceipt
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update preferences.", type: "ERROR" });
				});
			},

			/**
			 * Assigns an instructor to a comment
			 *
			 * @param {*} instructorId
			 * @param {*} year
			 * @param {*} workgroupId
			 * @param {*} comment
			 */
			addInstructorAssignment: function (instructorId, year, workgroupId, comment) {
				var scheduleInstructorNote = {};
				scheduleInstructorNote.instructorId = instructorId;
				scheduleInstructorNote.comment = comment;

				_self.AssignmentService.addScheduleInstructorNote(instructorId, year, workgroupId, comment).then(function (scheduleInstructorNote) {
					_self.$rootScope.$emit('toast', { message: "Added instructor comment", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_SCHEDULE_INSTRUCTOR_NOTE,
						payload: {
							scheduleInstructorNote: scheduleInstructorNote
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not add instructor comment.", type: "ERROR" });
				});
			},

			/**
			 * Assigns an instructor who did not have a teaching preference.
			 *
			 * @param {*} teachingAssignment
			 * @param {*} scheduleId
			 */
			addAndApproveInstructorAssignment: function (teachingAssignment, scheduleId) {
				_self.AssignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (teachingAssignment) {
					ipa_analyze_event('instructor assignments', 'instructor without preference assigned');

					_self.$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var sectionGroup = AssignmentStateService._state.sectionGroups.list[teachingAssignment.sectionGroupId];

					if (sectionGroup) {
						sectionGroup.isAssigned = true;
						sectionGroup.showTheStaff= false;
					}
					var action = {
						type: ActionTypes.ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: teachingAssignment
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},

			/**
			 * Assigns an instructor type to a course (as opposed to an instructor)
			 *
			 * @param {*} teachingAssignment
			 */
			assignInstructorType: function (teachingAssignment) {
				var scheduleId = AssignmentStateService._state.userInterface.scheduleId;

				_self.AssignmentService.addInstructorAssignment(teachingAssignment, scheduleId).then(function (newTeachingAssignment) {
					ipa_analyze_event('instructor assignments', 'instructor type assigned');

					_self.$rootScope.$emit('toast', { message: "Assigned instructor type", type: "SUCCESS" });
					var sectionGroup = AssignmentStateService._state.sectionGroups.list[newTeachingAssignment.sectionGroupId];

					if (sectionGroup) {
						sectionGroup.isAssigned = true;
					}
					_self.AssignmentStateService.reduce({
						type: ActionTypes.ADD_TEACHING_ASSIGNMENT,
						payload: {
							teachingAssignment: newTeachingAssignment
						}
					});
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor type.", type: "ERROR" });
				});
			},
			assignStudentToAssociateInstructor: function (sectionGroup, supportStaff) {
				var here = this;
				_self.AssignmentService.assignStudentToAssociateInstructor(sectionGroup.id, supportStaff.id).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Assigned Associate Instructor", type: "SUCCESS" });

					var instructor = {
						id: teachingAssignment.instructorId,
						firstName: supportStaff.firstName,
						lastName: supportStaff.lastName,
						fullName: supportStaff.fullName,
						email: supportStaff.emailAddress,
						loginId: supportStaff.loginId
					};

					_self.AssignmentStateService.reduce({
						type: ActionTypes.ASSIGN_ASSOCIATE_INSTRUCTOR,
						payload: {
							teachingAssignment: teachingAssignment,
							instructor: instructor,
							year: AssignmentStateService._state.userInterface.year
						}
					});

					here.addAndApproveInstructorAssignment(teachingAssignment, AssignmentStateService._state.userInterface.scheduleId);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			approveInstructorAssignment: function (teachingAssignment, workgroupId, year) {
				teachingAssignment.approved = true;

				_self.AssignmentService.updateInstructorAssignment(teachingAssignment).then(function (teachingAssignment) {
					ipa_analyze_event('instructor assignments', 'instructor assignment approved');

					$rootScope.$emit('toast', { message: "Assigned instructor to course", type: "SUCCESS" });
					var sectionGroup = AssignmentStateService._state.sectionGroups.list[teachingAssignment.sectionGroupId];

					if (sectionGroup) {
						sectionGroup.isAssigned = true;
						sectionGroup.showTheStaff= false;
					}
						var action = {
							type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign instructor to course.", type: "ERROR" });
				});
			},
			createPlaceholderStaff: function (sectionGroup) {
				_self.AssignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					_self.$rootScope.$emit('toast', { message: "Assigned The Staff", type: "SUCCESS" });

					sectionGroup.isAssigned = true;

						var action = {
							type: ActionTypes.CREATE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not assign The Staff.", type: "ERROR" });
				});
			},
			removePlaceholderStaff: function (sectionGroup) {
				_self.AssignmentService.updateSectionGroup(sectionGroup).then(function (sectionGroup) {
					_self.$rootScope.$emit('toast', { message: "Removed The Staff", type: "SUCCESS" });

					sectionGroup.isAssigned = false;

						var action = {
							type: ActionTypes.REMOVE_PLACEHOLDER_STAFF,
							payload: {
								sectionGroup: sectionGroup
							}
						};
						_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove The Staff.", type: "ERROR" });
				});
			},
			unapproveInstructorAssignment: function (originalTeachingAssignment) {
				originalTeachingAssignment.approved = false;
				_self.AssignmentService.updateInstructorAssignment(originalTeachingAssignment).then(function (teachingAssignment) {
					_self.$rootScope.$emit('toast', { message: "Removed instructor from course", type: "SUCCESS" });
					var sectionGroup = AssignmentStateService._state.sectionGroups.list[originalTeachingAssignment.sectionGroupId];
					var action;

					if (sectionGroup) {
						sectionGroup.isAssigned = false;

						for (var i in sectionGroup.teachingAssignmentIds) {
							var teachingAssignment = AssignmentStateService._state.teachingAssignments.list[sectionGroup.teachingAssignmentIds[i]];

							if (teachingAssignment.approved == true) {
								sectionGroup.isAssigned = true;
								break;
							}
						}
					}
					// If unapproving a teachingPreference that was not created by the instructor, delete it instead
					if (originalTeachingAssignment.fromInstructor === false && originalTeachingAssignment.approved === false) {

						action = {
							type: ActionTypes.REMOVE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: originalTeachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);

					} else {
						action = {
							type: ActionTypes.UPDATE_TEACHING_ASSIGNMENT,
							payload: {
								teachingAssignment: teachingAssignment
							}
						};
						_self.AssignmentStateService.reduce(action);
					}
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not remove instructor from course.", type: "ERROR" });
				});
			},
			addTeachingCallResponse: function (teachingCallResponse) {
				_self.AssignmentService.addTeachingCallResponse(teachingCallResponse).then(function (teachingCallResponse) {
					_self.$rootScope.$emit('toast', { message: "Updated availablities", type: "SUCCESS" });
					var action = {
						type: ActionTypes.ADD_TEACHING_CALL_RESPONSE,
						payload: {
							teachingCallResponse: teachingCallResponse
						}
					};
					_self.AssignmentStateService.reduce(action);
				}, function (err) {
					_self.$rootScope.$emit('toast', { message: "Could not update availabilities.", type: "ERROR" });
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
				_self.AssignmentStateService.reduce(action);
			},
			toggleDisplayCompletedInstructors: function (showCompletedInstructors) {
				var action = {
					type: ActionTypes.TOGGLE_COMPLETED_INSTRUCTORS,
					payload: {
						showCompletedInstructors: showCompletedInstructors
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			showInstructors: function () {
				var action = {
					type: ActionTypes.SWITCH_MAIN_VIEW,
					payload: {
						showInstructors: true,
						showCourses: false
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			toggleTermFilter: function (termId) {
				var action = {
					type: ActionTypes.TOGGLE_TERM_FILTER,
					payload: {
						termId: termId
					}
				};
				_self.AssignmentStateService.reduce(action);
			},
			updateTableFilter: function (query) {
				var action = {
					type: ActionTypes.UPDATE_TABLE_FILTER,
					payload: {
						query: query
					}
				};
				_self.AssignmentStateService.reduce(action);
			}
		};
	}
}

AssignmentActionCreators.$inject = ['AssignmentStateService', '$route', 'AssignmentService', '$rootScope', '$window', 'Role', 'ActionTypes'];

export default AssignmentActionCreators;
