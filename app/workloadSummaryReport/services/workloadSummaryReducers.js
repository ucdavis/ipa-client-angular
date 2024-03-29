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
			_scheduleInstructorNoteReducers: function (action, scheduleInstructorNotes) {
				switch (action.type) {
					case ActionTypes.GET_SCHEDULE_INSTRUCTOR_NOTES:
						return scheduleInstructorNotes || action.payload.scheduleInstructorNotes;
					default:
						return scheduleInstructorNotes;
				}
			},
			_sectionReducers: function (action, sections) {
				switch (action.type) {
					case ActionTypes.GET_SECTIONS:
						return sections || action.payload.sections;
					default:
						return sections;
				}
			},
			_workloadSnapshotReducers: function (action, workloadSnapshots) {
				switch (action.type) {
					case ActionTypes.GET_WORKLOAD_SNAPSHOTS:
						return action.payload;
					case ActionTypes.SELECT_WORKLOAD_SNAPSHOT:
						return {
							...workloadSnapshots,
							selected: action.payload
						};
					default:
						return workloadSnapshots;
				}
			},
			_calculationReducers: function (action, calculations) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						calculations = {
							isInitialFetchComplete: false,
							censusDataFetchBegun: false,
							dwCallsOpened: 0,
							dwCallsCompleted: 0
						};
						return calculations;
					case ActionTypes.INITIAL_FETCH_COMPLETE:
						calculations.isInitialFetchComplete = action.payload.isInitialFetchComplete;
						return calculations;
					case ActionTypes.BEGIN_CENSUS_DATA_FETCH:
						calculations.censusDataFetchBegun = true;
						return calculations;
						case ActionTypes.CALCULATE_VIEW:
						calculations.calculatedView = action.payload.calculatedView;
						return calculations;
					default:
						return calculations;
				}
			},
			_uiReducers: function (action, ui) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						ui = {
							showDownloadModal: false,
							showModalDismiss: false,
							userWorkgroupSnapshots: {}
						};
						return ui;
					case ActionTypes.GET_USER_WORKGROUP_SNAPSHOTS:
						ui.userWorkgroupSnapshots = action.payload;
						return ui;
					case ActionTypes.TOGGLE_DOWNLOAD_MODAL:
						ui.showDownloadModal = !ui.showDownloadModal;
						return ui;
					case ActionTypes.DOWNLOAD_MULTIPLE:
						ui.showModalDismiss = !ui.showModalDismiss;
						return ui;
					default:
						return ui;
				}
			},
			reduce: function (action) {
				var scope = this;

				let newState = {};
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.sections = scope._sectionReducers(action, scope._state.sections);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);
				newState.calculations = scope._calculationReducers(action, scope._state.calculations);
				newState.users = scope._userReducers(action, scope._state.users);
				newState.userRoles = scope._userRoleReducers(action, scope._state.userRoles);
				newState.scheduleInstructorNotes = scope._scheduleInstructorNoteReducers(action, scope._state.scheduleInstructorNotes);
				newState.workloadSnapshots = scope._workloadSnapshotReducers(action, scope._state.workloadSnapshots);
				newState.ui = scope._uiReducers(action, scope._state.ui);

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
