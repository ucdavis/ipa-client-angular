class WorkloadSummaryStateService {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return action.payload.sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_instructorReducers: function (action, instructors) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return action.payload.instructors;
					default:
						return instructors;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return action.payload.courses;
					default:
						return courses;
				}
			},
			_calculationReducers: function (action, calculations) {
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						return action.payload.courses;
					default:
						return courses;
				}
			},
			reduce: function (action) {
				var scope = this;

				let newState = {};
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.instructors = scope._instructorReducers(action, scope._state.instructors);
				newState.calculations = scope._calculationReducers(action, scope._state.calculations);

				scope._state = newState;
				$rootScope.$emit('reportStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};
	}
}

ScheduleSummaryReportStateService.$inject = ['$rootScope', 'ActionTypes'];

export default WorkloadSummaryStateService;
