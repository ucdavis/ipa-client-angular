class WorkloadSummaryStateService {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.GET_SECTION_GROUPS:
						return sectionGroups || action.payload.sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.GET_INSTRUCTORS:
						return instructors || action.payload.instructors;
					default:
						return instructors;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.GET_INSTRUCTOR_TYPES:
						return instructorTypes || action.payload.instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.GET_COURSES:
						return courses || action.payload.courses;
					default:
						return courses;
				}
			},
			_userReducers: function (action, users) {
				switch (action.type) {
					case ActionTypes.GET_USERS:
						return users || action.payload.users;
					default:
						return users;
				}
			},
			_userRoleReducers: function (action, userRoles) {
				switch (action.type) {
					case ActionTypes.GET_USER_ROLES:
						return userRoles || action.payload.userRoles;
					default:
						return userRoles;
				}
			},
			_teachingAssignmentReducers: function (action, teachingAssignments) {
				switch (action.type) {
					case ActionTypes.GET_TEACHING_ASSIGNMENTS:
						return teachingAssignments || action.payload.teachingAssignments;
					default:
						return teachingAssignments;
				}
			},
			_calculationReducers: function (action, calculations) {
				calculations = calculations || {
					isInitialFetchComplete: false
				};

				switch (action.type) {
					case ActionTypes.INITIAL_FETCH_COMPLETE:
						calculations.isInitialFetchComplete = action.payload.isInitialFetchComplete;
					return calculations;
					default:
						return calculations;
				}
			},
			reduce: function (action) {
				var scope = this;

				let newState = {};
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.calculations = scope._calculationReducers(action, scope._state.calculations);

				scope._state = newState;
				$rootScope.$emit('workloadSummaryStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};
	}
}

WorkloadSummaryStateService.$inject = ['$rootScope', 'ActionTypes'];

export default WorkloadSummaryStateService;
