class DeansOfficeReportReducers {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {},
			_budgetReducer: function (action, budget) {
				switch (action.type) {
					case ActionTypes.GET_BUDGET:
						return budget || action.payload.budget;
					default:
						return budget;
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
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.GET_SECTION_GROUPS:
						return sectionGroups || action.payload.sectionGroups;
					default:
						return sectionGroups;
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
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.GET_INSTRUCTOR_TYPES:
						return instructorTypes || action.payload.instructorTypes;
					default:
						return instructorTypes;
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
				switch (action.type) {
					case ActionTypes.INIT_STATE:
						calculations = {
							isInitialFetchComplete: false
						};
						return calculations;
					case ActionTypes.CALCULATE_VIEW:
						calculations.calculatedView = action.payload.calculatedView;
						return calculations;
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
				newState.budget = scope._budgetReducer(action, scope._state.budget);
				newState.courses = scope._courseReducers(action, scope._state.courses);
				newState.sectionGroups = scope._sectionGroupReducers(action, scope._state.sectionGroups);
				newState.sections = scope._sectionReducers(action, scope._state.sections);
				newState.instructorTypes = scope._instructorTypeReducers(action, scope._state.instructorTypes);
				newState.teachingAssignments = scope._teachingAssignmentReducers(action, scope._state.teachingAssignments);

				newState.calculations = scope._calculationReducers(action, scope._state.calculations);

				scope._state = newState;
				$rootScope.$emit('deansOfficeReportStateChanged', {
					state: scope._state,
					action: action
				});
			}
		};
	}
}

DeansOfficeReportReducers.$inject = ['$rootScope', 'ActionTypes'];

export default DeansOfficeReportReducers;
