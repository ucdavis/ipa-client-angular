class DeansOfficeReportCalculations {
	constructor(DeansOfficeReportReducers, ActionTypes, Roles) {
		return {
			calculateView: function () {
				var _self = this;

				var budget = DeansOfficeReportReducers._state.budget;
				var courses = DeansOfficeReportReducers._state.courses;
				var sectionGroups = DeansOfficeReportReducers._state.sectionGroups;
				var sections = DeansOfficeReportReducers._state.sections;
				var teachingAssignments = DeansOfficeReportReducers._state.teachingAssignments;
				var instructorTypes = DeansOfficeReportReducers._state.instructorTypes;

				debugger;
				var calculatedView = {
					current: {
						costs: _generateCosts(),
						funding: _generateFunding(),
						miscStats: _generateMiscStats(courses.current, sectionGroups.current, sections.current)
					},
					previous: {
						costs: _generateCosts(),
						funding: _generateFunding(),
						miscStats: _generateMiscStats(courses.previous, sectionGroups.previous, sections.previous)
					}
				};

				calculatedView.change = {
					costs: _generateCostChange(),
					funding: _generatefundingChange(),
					miscStats: _generateMiscStatsChange(calculatedView.current.miscStats, calculatedView.previous.miscStats)
				};

				// TODO: Add instructorTypeCosts, instructorCosts and sectionGroupCosts to figure out what cost to use per course/instructor
				// TODO: Add lineItems for funding

				// section 1: (costs)
				// A) instructors:
				// - how many courses taught by each instructorType
				// - how much did each instructorType cost for the year (assuming which scenario?)

				// B) TAs / readers:
				// - find TA cost for this schedule
				// - find reader cost for this schedule
				// - figure out how many TAs
				// - figure out how many readers

				// C) section 1 totals


				// section 2: (funding)
				// -lecturer funding (we don't currently have a way of tracking this)
				// -AI funding (we don't currently have a way of tracking this)

				// section 3: (misc stats)
				// total courses:
				// -lower
				// -upper
				// -total

				// total seats: (excluding grad)
				// -lower
				// -upper
				// -total



				DeansOfficeReportReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
			},
			_generateMiscStats(courses, sectionGroups, sections) {

			}
		};
	}
}

DeansOfficeReportCalculations.$inject = ['DeansOfficeReportReducers', 'ActionTypes', 'Roles'];

export default DeansOfficeReportCalculations;
