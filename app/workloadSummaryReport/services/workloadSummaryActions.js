class WorkloadSummaryActions {
	constructor(WorkloadSummaryReducers, WorkloadSummaryService, $rootScope, ActionTypes, Roles) {
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
			},
			_getCourses: function (workgroupId, year) {
				var _self = this;
				WorkloadSummaryService.getCourses(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_COURSES,
						payload: {
							courses: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUsers: function (workgroupId, year) {
				var _self = this;
				WorkloadSummaryService.getUsers(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USERS,
						payload: {
							courses: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getUserRoles: function (workgroupId, year) {
				var _self = this;
				WorkloadSummaryService.getUserRoles(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_USER_ROLES,
						payload: {
							courses: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructorTypes: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructorTypes(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTOR_TYPES,
						payload: {
							instructorTypes: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getInstructors: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getInstructors(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_INSTRUCTORS,
						payload: {
							instructors: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getTeachingAssignments: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getTeachingAssignments(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_TEACHING_ASSIGNMENTS,
						payload: {
							teachingAssignments: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_getSectionGroups: function (workgroupId, year) {
				var _self = this;

				WorkloadSummaryService.getSectionGroups(workgroupId, year).then(function (payload) {
					WorkloadSummaryReducers.reduce({
						type: ActionTypes.GET_SECTION_GROUPS,
						payload: {
							sectionGroups: payload
						}
					});

					_self._performCalculations();
				}, function (err) {
					$rootScope.$emit('toast', { message: "Could not load Workload Summary Report information.", type: "ERROR" });
				});
			},
			_performCalculations: function () {
				this._isInitialFetchComplete();
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
					var instructorTypeId = _self._getInstructorType(instructor, teachingAssignments, userRoles);

					if (calculatedView.instructorTypeIds.indexOf(instructorTypeId) == -1) {
						calculatedView.instructorTypeIds.push(instructorTypeId);
						calculatedView.byInstructorType[instructorTypeId] = [];
					}

					var instructorAssignments = _getInstructorAssignments(instructorId, sectionGroups);
					debugger;

					// Find quarter
					// Find course (subj/num) (or non-sectionGroup assignment type)

					// If sectionGroup based, also find:
					// Find sequence pattern
					// Find Enrollment
					// Find previous enrollment 
					// Find units
					// Find SCH

					calculatedView.byInstructorType[instructorTypeId].push(instructor);
				});
			},
			_getInstructorTypeId: function (instructor, teachingAssignments, userRoles) {
				var user = _getUserByLoginId(loginId);

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

WorkloadSummaryActions.$inject = ['WorkloadSummaryReducers', 'WorkloadSummaryService', '$rootScope', 'ActionTypes', 'Roles'];

export default WorkloadSummaryActions;
