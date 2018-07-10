class DeansOfficeReportReducers {
	constructor ($rootScope, ActionTypes) {
		return {
			_state: {
				budget: {},
				courses: {},
				sectionGroups: {},
				sections: {},
				instructorTypes: {},
				teachingAssignments: {}
			},
			_budgetReducer: function (action, budget) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_BUDGET:
						return budget.current || action.payload.budget;
					case ActionTypes.GET_PREVIOUS_BUDGET:
						return budget.previous || action.payload.budget;
					default:
						return budget;
				}
			},
			_courseReducers: function (action, courses) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_COURSES:
						return courses.current || action.payload.courses;
					case ActionTypes.GET_PREVIOUS_COURSES:
						return courses.previous || action.payload.courses;
					default:
						return courses;
				}
			},
			_sectionGroupReducers: function (action, sectionGroups) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_SECTION_GROUPS:
						return sectionGroups.current || action.payload.sectionGroups;
					case ActionTypes.GET_PREVIOUS_SECTION_GROUPS:
						return sectionGroups.previous || action.payload.sectionGroups;
					default:
						return sectionGroups;
				}
			},
			_sectionReducers: function (action, sections) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_SECTIONS:
						return sections.current || action.payload.sections;
					case ActionTypes.GET_PREVIOUS_SECTIONS:
						return sections.previous || action.payload.sections;
					default:
						return sections;
				}
			},
			_instructorTypeReducers: function (action, instructorTypes) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_INSTRUCTOR_TYPES:
						return instructorTypes.current || action.payload.instructorTypes;
					case ActionTypes.GET_PREVIOUS_INSTRUCTOR_TYPES:
						return instructorTypes.previous || action.payload.instructorTypes;
					default:
						return instructorTypes;
				}
			},
			_teachingAssignmentReducers: function (action, teachingAssignments) {
				switch (action.type) {
					case ActionTypes.GET_CURRENT_TEACHING_ASSIGNMENTS:
						return teachingAssignments.current || action.payload.teachingAssignments;
					case ActionTypes.GET_PREVIOUS_TEACHING_ASSIGNMENTS:
						return teachingAssignments.previous || action.payload.teachingAssignments;
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
					case ActionTypes.PREVIOUS_YEAR_FETCH_COMPLETE:
						calculations.isPreviousYearFetchComplete = action.payload.isPreviousYearFetchComplete;
						return calculations;
					case ActionTypes.CURRENT_YEAR_FETCH_COMPLETE:
						calculations.isCurrentYearFetchComplete = action.payload.isCurrentYearFetchComplete;
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
