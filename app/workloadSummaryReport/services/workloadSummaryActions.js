class WorkloadSummaryActions {
	constructor(WorkloadSummaryReducers, WorkloadSummaryService, $rootScope, ActionTypes, Roles, TermService) {
		this.WorkloadSummaryReducers = WorkloadSummaryReducers;
		this.WorkloadSummaryService = WorkloadSummaryService;
		this.$rootScope = $rootScope;
		this.ActionTypes = ActionTypes;

		return {
			getInitialState: function (workgroupId, year) {
				var _self = this;

				this._getCourses(workgroupId, year);
				this._getInstructorTypes(workgroupId, year);
				this._getInstructors(workgroupId, year);
				this._getTeachingAssignments(workgroupId, year);
				this._getSectionGroups(workgroupId, year);
				this._getUsers(workgroupId, year);
				this._getUserRoles(workgroupId, year);

			},
			_getCourses: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getCourses(workgroupId, year).then(function (rawCourses) {
					let courses = {
						ids: [],
						list: {}
					};

					rawCourses.forEach(function(course) {
						courses.ids.push(course.id);
						courses.list[course.id] = course;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_COURSES,
						payload: {
							courses: courses
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUsers: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getUsers(workgroupId, year).then(function (rawUsers) {
					let users = {
						ids: [],
						list: {}
					};

					rawUsers.forEach(function(user) {
						users.ids.push(user.id);
						users.list[user.id] = user;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USERS,
						payload: {
							users: users
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUserRoles: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getUserRoles(workgroupId, year).then(function (rawUserRoles) {
					let userRoles = {
						ids: [],
						list: {}
					};

					rawUserRoles.forEach(function(userRole) {
						userRoles.ids.push(userRole.id);
						userRoles.list[userRole.id] = userRole;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USER_ROLES,
						payload: {
							userRoles: userRoles
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructorTypes(workgroupId, year).then(function (rawInstructorTypes) {
					let instructorTypes = {
						ids: [],
						list: {}
					};

					rawInstructorTypes.forEach(function(instructorType) {
						instructorTypes.ids.push(instructorType.id);
						instructorTypes.list[instructorType.id] = instructorType;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTOR_TYPES,
						payload: {
							instructorTypes: instructorTypes
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructors: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructors(workgroupId, year).then(function (rawInstructors) {
					let instructors = {
						ids: [],
						list: {}
					};

					rawInstructors.forEach(function(instructor) {
						instructors.ids.push(instructor.id);
						instructors.list[instructor.id] = instructor;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTORS,
						payload: {
							instructors: instructors
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getTeachingAssignments(workgroupId, year).then(function (rawTeachingAssignments) {
					let teachingAssignments = {
						ids: [],
						list: {}
					};

					rawTeachingAssignments.forEach(function(teachingAssignment) {
						teachingAssignments.ids.push(teachingAssignment.id);
						teachingAssignments.list[teachingAssignment.id] = teachingAssignment;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_TEACHING_ASSIGNMENTS,
						payload: {
							teachingAssignments: teachingAssignments
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getSectionGroups(workgroupId, year).then(function (rawSectionGroups) {
					let sectionGroups = {
						ids: [],
						list: {}
					};

					rawSectionGroups.forEach(function(sectionGroup) {
						sectionGroups.ids.push(sectionGroup.id);
						sectionGroups.list[sectionGroup.id] = sectionGroup;
					});

					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_SECTION_GROUPS,
						payload: {
							sectionGroups: sectionGroups
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_performCalculations: function () {
				this._isInitialFetchComplete();

				if (WorkloadSummaryReducers._state.calculations.isInitialFetchComplete) {
					this._calculateView();
				}
			},
			_isInitialFetchComplete: function () {
				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;
				var courses = WorkloadSummaryReducers._state.courses;
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var instructors = WorkloadSummaryReducers._state.instructors;
				var instructorTypes = WorkloadSummaryReducers._state.instructorTypes;
				var users = WorkloadSummaryReducers._state.users;
				var userRoles = WorkloadSummaryReducers._state.userRoles;

				if (sectionGroups && courses && teachingAssignments && instructors && instructorTypes && users && userRoles) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.INITIAL_FETCH_COMPLETE,
						payload: {
							isInitialFetchComplete: true
						}
					});
				}
			},
			_calculateView: function () {
				var _self = this;

				var sectionGroups = WorkloadSummaryReducers._state.sectionGroups;
				var courses = WorkloadSummaryReducers._state.courses;
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var instructors = WorkloadSummaryReducers._state.instructors;
				var instructorTypes = WorkloadSummaryReducers._state.instructorTypes;
				var users = WorkloadSummaryReducers._state.users;
				var userRoles = WorkloadSummaryReducers._state.userRoles;

				var calculatedView = {
					instructorTypeIds: [],
					byInstructorType: {}
				};

				instructors.ids.forEach(function(instructorId) {
					var instructor = instructors.list[instructorId];
					var instructorTypeId = _self._getInstructorTypeId(instructor);

					if (calculatedView.instructorTypeIds.indexOf(instructorTypeId) == -1) {
						calculatedView.instructorTypeIds.push(instructorTypeId);
						calculatedView.byInstructorType[instructorTypeId] = [];
					}

					instructor.assignments = [];
					instructor.totals = {
						units: 0,
						studentCreditHours: 0,
						enrollment: 0,
						previousEnrollment: 0,
						assignmentCount: 0
					};

					var instructorAssignments = _self._getInstructorAssignments(instructorId, teachingAssignments);

					instructorAssignments.forEach(function(teachingAssignment) {
						var assignment = {};

						var termCode = teachingAssignment.termCode;

						assignment.term = TermService.getTermName(termCode);

						assignment.description = null;

						if (teachingAssignment.buyout) {
							assignment.description = "Buyout";
						} else if (teachingAssignment.courseRelease) {
							assignment.description = "Course Release";
						} else if (teachingAssignment.sabbatical) {
							assignment.description = "Sabbatical";
						} else if (teachingAssignment.inResidence) {
							assignment.description = "In Residence";
						} else if (teachingAssignment.workLifeBalance) {
							assignment.description = "Work Life Balance";
						} else if (teachingAssignment.leaveOfAbsence) {
							assignment.description = "Leave of Absence";
						}

						if (teachingAssignment.sectionGroupId > 0) {
							var sectionGroup = sectionGroups.list[teachingAssignment.sectionGroupId];
							var course = courses.list[sectionGroup.courseId];

							assignment.description = course.subjectCode + " " + course.courseNumber;
							assignment.sequencePattern = course.sequencePattern;
							assignment.enrollment = sectionGroup.plannedSeats;
							assignment.previousEnrollment = null;
							assignment.units = _self._getUnits(course);
							assignment.studentCreditHours = assignment.enrollment * assignment.units;
						}

						instructor.assignments.push(assignment);

						instructor.totals.units += assignment.units || 0;
						instructor.totals.studentCreditHours += assignment.studentCreditHours || 0;
						instructor.totals.enrollment += assignment.enrollment || 0;
						instructor.totals.previousEnrollment += assignment.previousEnrollment || 0;
						instructor.totals.assignmentCount += 1;
					});

					calculatedView.byInstructorType[instructorTypeId].push(instructor);
				});

				WorkloadSummaryReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
			},
			_getUnits: function (course) {
				if (course.unitsLow > 0) {
					return course.unitsLow;
				} else if (course.unitsHigh > 0) {
					return course.unitsHigh;
				}

				return 0;
			},
			_getInstructorTypeId: function (instructor) {
				var teachingAssignments = WorkloadSummaryReducers._state.teachingAssignments;
				var users = WorkloadSummaryReducers._state.users;
				var userRoles = WorkloadSummaryReducers._state.userRoles;

				var user = this._getUserByLoginId(instructor.loginId, users);

				// Attempt to find via userRole
				for (var i = 0; i < userRoles.ids.length; i++) {
					var userRole = userRoles.list[userRoles.ids[i]];

					if (userRole.roleId == Roles.instructor && userRole.userId == user.id) {
						return userRole.instructorTypeId;
					}
				}

				// Attempt to find via teachingAssignment
				for (var i = 0; i < teachingAssignments.ids.length; i++) {
					var teachingAssignment = teachingAssignments.list[teachingAssignments.ids[i]];

					if (teachingAssignment.instructorId == instructor.id) {
						return teachingAssignment.instructorTypeId;
					}
				}

				return null;
			},
			_getUserByLoginId: function (loginId, users) {
				for (var i = 0; i < users.ids.length; i++) {
					var user = users.list[users.ids[i]];

					if (user.loginId == loginId) {
						return user;
					}
				}

				return null;
			},
			_getInstructorAssignments: function (instructorId, teachingAssignments) {
				var instructorAssignments = [];

				teachingAssignments.ids.forEach(function(teachingAssignmentId) {
					var teachingAssignment = teachingAssignments.list[teachingAssignmentId];

					if (teachingAssignment.instructorId == instructorId) {
						instructorAssignments.push(teachingAssignment);
					}
				});

				return instructorAssignments;
			}
		};
	}
}

WorkloadSummaryActions.$inject = ['WorkloadSummaryReducers', 'WorkloadSummaryService', '$rootScope', 'ActionTypes', 'Roles', 'TermService'];

export default WorkloadSummaryActions;
