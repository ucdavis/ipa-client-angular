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

				var calculatedView = {
					current: {
						costs: this._generateCosts(),
						funding: this._generateFunding(),
						miscStats: this._generateMiscStats(courses.current, sectionGroups.current, sections.current)
					},
					previous: {
						costs: this._generateCosts(),
						funding: this._generateFunding(),
						miscStats: this._generateMiscStats(courses.previous, sectionGroups.previous, sections.previous)
					}
				};

				calculatedView.change = {
					costs: this._generateCostChange(),
					funding: this._generatefundingChange(),
					miscStats: this._generateMiscStatsChange(calculatedView.current.miscStats, calculatedView.previous.miscStats)
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

				DeansOfficeReportReducers.reduce({
					type: ActionTypes.CALCULATE_VIEW,
					payload: {
						calculatedView: calculatedView
					}
				});
			},
			_generateMiscStats(courses, sectionGroups, sections) {
				var miscStats = {
					lower: {
						courses: 0,
						seats: 0
					},
					upper: {
						courses: 0,
						seats: 0
					},
					grad: {
						courses: 0,
						seats: 0
					},
					total: {
						courses: 0,
						seats: 0
					}
				};

				sections.ids.forEach((sectionId) => {
					var section = sections.list[sectionId];
					var sectionGroup = sectionGroups.list[section.sectionGroupId];
					var course = courses.list[sectionGroup.courseId];

					var courseNumber = parseInt(course.courseNumber);
					var seats = section.seats;

					if (courseNumber < 100) {
						miscStats.lower.courses += 1;
						miscStats.lower.seats += seats;
					} else if (courseNumber >= 200) {
						miscStats.grad.courses += 1;
						miscStats.grad.seats += seats;
					} else {
						miscStats.upper.courses += 1;
						miscStats.upper.seats += seats;
					}
				});

				miscStats.total.courses = miscStats.lower.courses + miscStats.grad.courses + miscStats.upper.courses;
				miscStats.total.seats = miscStats.lower.courses + miscStats.upper.courses;

				return miscStats;
			},
			_generateCosts() {

			},
			_generateFunding() {

			},
			_generateCostChange() {

			},
			_generatefundingChange() {

			},
			_generateMiscStatsChange() {

			}
		};
	}
}

DeansOfficeReportCalculations.$inject = ['DeansOfficeReportReducers', 'ActionTypes', 'Roles'];

export default DeansOfficeReportCalculations;
